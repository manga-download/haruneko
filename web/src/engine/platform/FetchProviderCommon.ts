import protobuf from 'protobufjs';
import { Exception, InternalError } from '../Error';
import { EngineResourceKey as R } from '../../i18n/ILocale';
import { CreateRemoteBrowserWindow } from './RemoteBrowserWindow';
import { CheckAntiScrapingDetection, FetchRedirection } from './AntiScrapingDetection';
import { ShouldReloadStalledChallenge } from './ChallengeReload';
import type { FeatureFlags } from '../FeatureFlags';
import { Delay, SetTimeout, ClearTimeout } from '../BackgroundTimers';

export abstract class FetchProvider {

    private featureFlags: FeatureFlags;

    protected async ValidateResponse(response: Response): Promise<void> {
        if (/challenge/i.test(response.headers.get('CF-Mitigated'))) {
            throw new Exception(R.FetchProvider_Fetch_CloudFlareChallenge, response.url);
        }
        if (/challenge/i.test(response.headers.get('X-Vercel-Mitigated'))) {
            throw new Exception(R.FetchProvider_Fetch_VercelChallenge, response.url);
        }
        if (response.status === 403) {
            throw new Exception(R.FetchProvider_Fetch_Forbidden, response.url);
        }
    }

    /**
     * ...
     */
    public Initialize(featureFlags: FeatureFlags): void {
        this.featureFlags = featureFlags;
    }

    /**
     * ...
     * @param request - ...
     */
    public abstract Fetch(request: Request): Promise<Response>;

    /**
     * Fetch and parse the remote HTML content into a virtual {@link Document} for further processing.
     * @param request - The request used to fetch the remote content.
     * @returns A virtual DOM with limited capabilities:
     *    - Since the document is detached it will not be rendered, therefore certain behavior may not be as expected (e.g., innerText is the same as textContent)
     *    - The document uses the base URL of the application instead of `request.url`, which affects all expanded links in the document
     */
    public async FetchHTML(request: Request): Promise<Document> {
        const mime = 'text/html';
        const charsetPattern = /charset=([\w-]+)/;

        const response = await this.Fetch(request);
        const data = await response.arrayBuffer();
        let document = new DOMParser().parseFromString(new TextDecoder().decode(data), mime);

        const charset = document.head?.querySelector<HTMLMetaElement>('meta[charset]')?.getAttribute('charset')
            || document.head?.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Type"]')?.content?.match(charsetPattern)?.at(1)
            || response.headers?.get('Content-Type')?.match(charsetPattern)?.at(1)
            || 'UTF-8';

        document = /UTF-?8/i.test(charset) ? document : new DOMParser().parseFromString(new TextDecoder(charset).decode(data), mime);

        // NOTE: Monkey patching the `innerText` property, stripping whitespaces as it would be rendered when attached to window DOM
        const selectors = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'div', 'span', 'a', 'li' ].join(', ');
        for (const element of document.body.querySelectorAll<HTMLElement>(selectors)) {
            Object.defineProperty(element, 'innerText', {
                get: () => element.textContent?.replace(/\s+/g, ' ').trim()
            });
        }

        return document;
    }

    /**
     * ...
     * @param request - ...
     */
    public async FetchJSON<T extends JSONElement>(request: Request): Promise<T> {
        const response = await this.Fetch(request);
        return response.json();
    }

    /**
     * ...
     * @param request - ...
     * @param query - ...
     */
    public async FetchCSS<T extends HTMLElement>(request: Request, query: string): Promise<T[]> {
        const dom = await this.FetchHTML(request);
        return [ ...dom.querySelectorAll(query) ] as T[];
    }

    /**
     * Perform a GraphQL request (POST) to a desired endpoint and returns JSON data.
     * @param operationName - The name of the query to be performed or `undefined` for unnamed queries
     * @param query - A valid GraphQL query
     * @param variables - A JSONObject containing the variables of the query.
     * @param extensions - ...
     */
    public async FetchGraphQL<T extends JSONElement>(request: Request, operationName: string, query: string | undefined, variables: JSONObject, extensions: JSONObject | undefined = undefined): Promise<T> {

        const graphQLRequest = new Request(request.url, {
            method: 'POST',
            body: JSON.stringify({ operationName, query, variables, extensions }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
        });

        // NOTE: Copy custom headers from parent request
        for (const header of request.headers) {
            graphQLRequest.headers.set(header.at(0), header.at(1));
        }

        type GraphQLResult = {
            errors: {
                code: number;
                message: string;
            }[];
            data: T;
        };

        const data = await this.FetchJSON<GraphQLResult>(graphQLRequest);
        if (data.errors && data.errors.length > 0) {
            throw new Exception(R.FetchProvider_FetchGraphQL_AggregateError, data.errors.map(error => error.message).join('\n'));
        }
        if (!data.data) {
            throw new Exception(R.FetchProvider_FetchGraphQL_MissingDataError);
        }
        return data.data;
    }

    /**
     * ...
     * @param request - ...
     * @param regex - ...
     */
    public async FetchRegex(request: Request, regex: RegExp): Promise<string[]> {
        if (regex.flags.indexOf('g') === -1) {
            throw new InternalError(`The provided RegExp must contain the global 'g' modifier!`);
        }
        const response = await fetch(request);
        const data = await response.text();
        const result: string[] = [];
        let match = undefined;
        while (match = regex.exec(data)) {
            result.push(match.at(1));
        }
        return result;
    }

    /**
     * Fetch and decode a protocol buffer message.
     * @param schema - The schema of the protocol buffer including all supported message definitions
     * @param messageTypePath - The name of the package and schema type separated by a `.` which should be used to decode the response
     * @returns The decoded response data
     */
    public async FetchProto<T extends JSONElement>(request: Request, schema: string, messageTypePath: string): Promise<T> {
        const response = await fetch(request);
        const serialized = new Uint8Array(await response.arrayBuffer());
        const prototype = protobuf.parse(schema, { keepCase: true }).root.lookupType(messageTypePath);
        return prototype.decode(serialized).toJSON() as T;
    }

    /*
    public async FetchXPATH(request: Request, xpath: string): Promise<Node[]> {
        const dom = await this.FetchHTML(request);
        const result = document.evaluate(xpath, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return new Array(result.snapshotLength).fill(null).map((_, index) => result.snapshotItem(index) as Node);
    }
    */

    /**
     * Scans the members of the given {@link payload} recursively, searching for the first occurence that fulfills the given {@link predicate}
     * and returns the corresponding value, or `undefined` if non was found.
     */
    #ExtractValueNextJS<T extends JSONElement>(payload: JSONElement, predicate: (data: JSONObject<JSONElement> | JSONArray<JSONElement>) => unknown): T {
        if (payload && typeof payload === 'object') {
            if (predicate(payload)) return payload as T;
            for (const value of Object.values(payload)) {
                const result = this.#ExtractValueNextJS<T>(value, predicate);
                if (result) return result;
            }
        }
        return undefined;
    }

    /**
     * Extract all NextJS hydrated flight data payloads from the HTML script tags of the provided {@link request}
     * and returns the first nested data element that fulfills the given {@link predicate} or `undefined` if non was found.
     * @remarks This is an extremely flakey extractor for NextJS flight data which needs much improvement for generic use.
     */
    public async FetchNextJS<T extends JSONElement>(request: Request, predicate: (data: JSONObject<JSONElement> | JSONArray<JSONElement>) => unknown): Promise<T | undefined> {
        const scripts = await this.FetchCSS<HTMLScriptElement>(request, 'script:not([src])');
        const payloads = scripts
            .map(script => script.text)
            .filter(script => script.includes('self.__next_f.push'))
            .map(script => {
                // TODO: Improve extraction robustness and variety (e.g., split line breaks into sub-scripts)
                try {
                    const content: string = JSON.parse(script.slice(script.indexOf(',"') + 1, -2));
                    return JSON.parse(content.slice(content.indexOf(':') + 1)) as JSONElement;
                } catch {
                    return {} as JSONElement;
                }
            });

        for (const payload of payloads) {
            const data: T = this.#ExtractValueNextJS<T>(payload, predicate);
            if (data) return data;
        }

        return undefined;
    }

    /**
     * Polls a Cloudflare challenge page and reloads it when the challenge is "managed" (no real widget rendered)
     * and a cf_clearance cookie is already present. This works around stalls where the page stays on
     * "Just a moment..." indefinitely because the invisible challenge never auto-resolves.
     */
    private async ReloadStalledCloudFlareChallenge(
        win: ReturnType<typeof CreateRemoteBrowserWindow>,
        url: string,
        budget: { remaining: number },
        invocations: { name: string; info: string }[]
    ): Promise<() => void> {
        const maxReloads = 3;
        const interval = 5000;

        const checkScript = `
            (() => {
                const hasRealWidget = !!document.querySelector(
                    '.cf-turnstile iframe, iframe[src*="challenges.cloudflare.com"], #challenge-stage input[type="checkbox"], .challenge-form [type="checkbox"]'
                );
                const title = (document.title || '').toLowerCase();
                const bodyText = (document.body?.innerText || '').toLowerCase();
                const isChallenge = title.includes('just a moment')
                    || title.includes('un instant')
                    || bodyText.includes('checking your browser')
                    || bodyText.includes('un instant');
                return {
                    isChallenge,
                    hasRealWidget
                };
            })()
        `;

        const doCheck = async () => {
            if (budget.remaining <= 0) return;
            try {
                const result = await win.ExecuteScript<{
                    isChallenge: boolean;
                    hasRealWidget: boolean;
                }>(checkScript);

                if (result?.isChallenge && !result?.hasRealWidget) {
                    // NOTE: `cf_clearance` is httpOnly, so `document.cookie` can never see it.
                    // Read the cookie through the debugger (CDP) instead — same session, httpOnly visible.
                    const cookies = await win.SendDebugCommand<{ cookies: { name: string; value: string }[] }>('Network.getCookies', { urls: [ url ] });
                    const cfClearance = cookies?.cookies?.find(cookie => cookie.name === 'cf_clearance');
                    if (budget.remaining > 0 && cfClearance && cfClearance.value.length > 200) {
                        budget.remaining--;
                        invocations.push({
                            name: 'ReloadStalledCloudFlareChallenge',
                            info: `Reload #${maxReloads - budget.remaining} (managed challenge, no widget, cf_clearance=${cfClearance.value.length})`
                        });
                        await win.ExecuteScript('window.location.reload()');
                    }
                }
            } catch {
                // Ignore errors from ExecuteScript on a navigating/closed window
            }
        };

        let timeoutId: number;
        const schedule = async () => {
            await doCheck();
            if (budget.remaining > 0) {
                timeoutId = await SetTimeout(schedule, interval);
            }
        };
        timeoutId = await SetTimeout(schedule, interval);

        return () => {
            if (timeoutId) ClearTimeout(timeoutId);
        };
    }

    /**
     * Open the given {@link request} in a new browser window and inject the given {@link script}.
     * @param request - ...
     * @param script - The JavaScript or function that will be evaluated within the browser window
     * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
     * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
     */
    public async FetchWindowScript<T extends void | JSONElement>(request: Request, script: string, delay?: number, timeout?: number): Promise<T> {
        return this.FetchWindowPreloadScript<T>(request, ``, script, delay, timeout);
    }

    /**
     * Open the given {@link request} in a new browser window and inject the given {@link script}.
     * @param request - ...
     * @param preload - The JavaScript or function that will be evaluated within the browser window before page is loaded
     * @param script - The JavaScript or function that will be evaluated within the browser window
     * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
     * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
     */
    public async FetchWindowPreloadScript<T extends void | JSONElement>(request: Request, preload: string, script: string, delay = 0, timeout = 60_000): Promise<T> {

        const invocations: {
            name: string;
            info: string;
        }[] = [];

        const win = CreateRemoteBrowserWindow();

        win.BeforeWindowNavigate.Subscribe(async uri => {
            invocations.push({ name: 'BeforeNavigate', info: `URL: ${uri.href}` });
            // NOTE: Do NOT hide the window here. The window is created with `show:false` and calling
            // `win.Hide()` flips the renderer to `document.hidden=true`, which makes Cloudflare's
            // managed challenge pause forever ("Un instant…" / "Just a moment…"). The `cf_clearance`
            // cookie is only issued while the window is actually visible, so sites that opted into the
            // stalled-challenge reload get `win.Show()` in the Automatic branch below; all other sites
            // keep the hidden window (no flash) and simply wait for the challenge to auto-resolve.
            return null;
        });

        const stopPollers: (() => void)[] = [];
        const reloadBudget = { remaining: 3 };

        const destroy = async () => {
            try {
                for (const stop of stopPollers) {
                    stop();
                }
                stopPollers.length = 0;
                if (this.featureFlags.VerboseFetchWindow.Value) {
                    console.log('FetchWindow()::invocations', invocations);
                } else {
                    win.Close();
                }
            } catch (error) {
                console.warn(error);
            }
        };

        return new Promise<T>(async (resolve, reject) => {
            let cancellation = await SetTimeout(async () => {
                await destroy();
                reject(new Exception(R.FetchProvider_FetchWindow_TimeoutError));
            }, timeout);

            win.DOMReady.Subscribe(async () => {
                invocations.push({ name: 'DOMReady', info: `Window: ${win}` });

                let redirect: FetchRedirection;

                // FIX: give a Cloudflare "managed" challenge ("Just a moment…" / "Un instant…") time to
                // auto-resolve BEFORE inspecting the page. Running any script in the window during the
                // challenge's ~1-2s proof/finalize window (the detection below) disturbs the challenge
                // and makes it reload into a fresh challenge forever (probe-verified: detection at
                // dom-ready loops, detection after ~2s auto-resolves and lists the mangas).
                await Delay(2500);

                // The challenge may auto-resolve (and thus navigate) right around the grace delay, which
                // tears down the execution context and makes `ExecuteScript` fail. Poll the read-only
                // Cloudflare check until the page settles instead of giving up on the first navigation race.
                const cloudflareDetectionScript = `
                    (() => {
                        const title = (document.title || '').toLowerCase();
                        const body = (document.body?.innerText || '').toLowerCase();
                        const isChallenge = title.includes('just a moment')
                            || title.includes('un instant')
                            || body.includes('checking your browser')
                            || body.includes('verify you are human')
                            || !!document.querySelector('.cf-turnstile, #challenge-stage, .challenge-form');
                        const hasRealWidget = !!document.querySelector('.cf-turnstile iframe, iframe[src*="challenges.cloudflare.com"], #challenge-stage input[type="checkbox"], .challenge-form [type="checkbox"]');
                        return { isChallenge, hasRealWidget };
                    })()
                `;

                let cloudflare: { isChallenge: boolean; hasRealWidget: boolean } | undefined;
                for (let attempt = 0; attempt < 20 && cloudflare === undefined; attempt++) {
                    try {
                        cloudflare = await win.ExecuteScript<{ isChallenge: boolean; hasRealWidget: boolean }>(cloudflareDetectionScript);
                    } catch {
                        await Delay(1000);
                    }
                }

                if (cloudflare?.isChallenge) {
                    redirect = cloudflare.hasRealWidget ? FetchRedirection.Interactive : FetchRedirection.Automatic;
                    invocations.push({ name: 'CloudflareDetected', info: cloudflare.hasRealWidget ? 'Interactive (real widget)' : 'Automatic (managed, wait for auto-resolve)' });
                } else {
                    try {
                        redirect = await CheckAntiScrapingDetection(win, request.url);
                    } catch (error) {
                        // The obfuscated anti-scraping detections can throw on pages whose DOM they do
                        // not expect (e.g. `removeChild` on a node missing after the reader hydrates).
                        // A failing detection must not block scraping: treat it as "no challenge".
                        console.warn('CheckAntiScrapingDetection failed, assuming no challenge:', error);
                        redirect = FetchRedirection.None;
                    }
                }

                invocations.push({ name: 'performRedirectionOrFinalize()', info: `Mode: ${FetchRedirection[ redirect ]}` });

                // Start poller only for sites that opted into the stalled-challenge reload
                // (reloading other sites' challenges — e.g. MangaFire's custom WAF — loops forever)
                const stalledReloadEnabled = ShouldReloadStalledChallenge(request.url);
                if (stalledReloadEnabled && reloadBudget.remaining > 0) {
                    stopPollers.push(await this.ReloadStalledCloudFlareChallenge(win, request.url, reloadBudget, invocations));
                }

                switch (redirect) {
                    case FetchRedirection.Interactive:
                        // NOTE: Allow the user to solve the captcha within 2.5 minutes before rejecting the request with an error
                        ClearTimeout(cancellation);
                        cancellation = await SetTimeout(() => {
                            destroy();
                            reject(new Exception(R.FetchProvider_FetchWindow_TimeoutError));
                        }, 150_000);
                        await win.Show();
                        break;
                    case FetchRedirection.Automatic:
                        // Managed challenge without a real widget. The `cf_clearance` cookie is only
                        // issued while the window is actually visible (probe-verified: a hidden window
                        // never receives it), so for sites that opted into the stalled-challenge reload
                        // (e.g. crunchyscan.org) we show the window to let the cookie settle, then the
                        // poller reloads once it is present. All other sites keep the fully-hidden
                        // background wait to avoid flashing a window.
                        if (stalledReloadEnabled) {
                            await win.Show();
                        }
                        break;
                    default:
                        ClearTimeout(cancellation);
                        try {
                            await Delay(delay);
                            const result = await win.ExecuteScript<T>(script);
                            await destroy();
                            resolve(result);
                        } catch (error) {
                            await destroy();
                            reject(error);
                        }
                }
            });

            invocations.push({ name: 'Open', info: `Request URL: ${request.url}` });
            await win.Open(request, this.featureFlags.VerboseFetchWindow.Value, preload);
        });
    }
}
