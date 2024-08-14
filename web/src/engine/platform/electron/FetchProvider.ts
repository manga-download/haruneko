import { Exception } from '../../Error';
import type { FeatureFlags } from '../../FeatureFlags';
import { EngineResourceKey as R } from '../../../i18n/ILocale';
import type { IPC } from '../InterProcessCommunication';
import RemoteBrowserWindow from './RemoteBrowserWindow';
import { FetchProvider, type ScriptInjection } from '../FetchProviderCommon';
import { FetchRedirection } from '../AntiScrapingDetection';
import { CheckAntiScrapingDetection } from './AntiScrapingDetection';
import { FetchProvider as Channels } from '../../../../../app/src/ipc/Channels';

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiForbiddenHeaders = [
    'User-Agent',
    'Referer',
    'Cookie',
    'Origin',
    'Host',
    'Sec-Fetch-Dest'
];

function ConcealHeaders(init: HeadersInit): Headers {
    const headers = new Headers(init);
    for(const name of fetchApiForbiddenHeaders) {
        if(headers.has(name)) {
            headers.set(fetchApiSupportedPrefix + name, headers.get(name));
            headers.delete(name);
        }
    }
    return headers;
}

class FetchRequest extends Request {
    constructor(input: URL | RequestInfo, init?: RequestInit) {
        if(init?.headers) {
            init.headers = ConcealHeaders(init.headers);
        }
        super(input, init);
    }
}

export default class extends FetchProvider {

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>, private readonly featureFlags: FeatureFlags) {
        super();
    }

    public Initialize(): void {

        // Abuse the global Request type to check if system is already initialized
        if(globalThis.Request === FetchRequest) {
            return;
        }

        // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
        globalThis.Request = FetchRequest;

        this.ipc.Send(Channels.App.Initialize, fetchApiSupportedPrefix);
    }

    async Fetch(request: Request): Promise<Response> {
        console.log('Platform::Electron::FetchProvider::Fetch()', '=>', request);
        const response = await fetch(request);
        await super.ValidateResponse(response);
        return response;
    }

    public async FetchWindowScript<T extends void | JSONElement>(request: Request, script: ScriptInjection<T>, delay?: number, timeout?: number): Promise<T> {
        console.warn('Platform::Electron::FetchProvider::FetchWindowScript()', '=>', request, script, delay, timeout);
        return this.FetchWindowPreloadScript<T>(request, () => undefined, script, delay, timeout);
    }

    public async FetchWindowPreloadScript<T extends void | JSONElement>(request: Request, preload: ScriptInjection<void>, script: ScriptInjection<T>, delay: number = 0, timeout: number = 60_000): Promise<T> {

        const invocations: {
            name: string;
            info: string
        }[] = [];

        const win = new RemoteBrowserWindow(this.ipc as IPC<string, string>);

        win.BeforeNavigate.Subscribe(async uri => {
            invocations.push({ name: 'BeforeNavigate', info: `URL: ${uri.href}` });
            return this.featureFlags.VerboseFetchWindow.Value ? null : win.Hide();
        });

        const destroy = async () => {
            try {
                if(this.featureFlags.VerboseFetchWindow.Value) {
                    console.log('FetchWindow()::invocations', invocations);
                } else {
                    win.Close();
                }
            } catch(error) {
                console.warn(error);
            }
        };

        return new Promise<T>(async (resolve, reject) => {
            let cancellation = setTimeout(() => {
                destroy();
                reject(new Exception(R.FetchProvider_FetchWindow_TimeoutError));
            }, timeout);

            win.DOMReady.Subscribe(async () => {
                invocations.push({ name: 'DOMReady', info: `Window: ${win}` });
                try {
                    const redirect = await CheckAntiScrapingDetection(async () => {
                        const html = await win.ExecuteScript<string>(`document.querySelector('html').innerHTML`);
                        return new DOMParser().parseFromString(html, 'text/html');
                    });
                    invocations.push({ name: 'performRedirectionOrFinalize()', info: `Mode: ${FetchRedirection[redirect]}`});
                    switch (redirect) {
                        case FetchRedirection.Interactive:
                            // NOTE: Allow the user to solve the captcha within 2.5 minutes before rejecting the request with an error
                            clearTimeout(cancellation);
                            cancellation = setTimeout(() => {
                                destroy();
                                reject(new Exception(R.FetchProvider_FetchWindow_TimeoutError));
                            }, 150_000);
                            await win.Show();
                            break;
                        case FetchRedirection.Automatic:
                            break;
                        default:
                            clearTimeout(cancellation);
                            await super.Wait(delay);
                            const result = await win.ExecuteScript<T>(script);
                            console.log('FetchWindowPreloadScript()', 'Result =>', result);
                            await destroy();
                            resolve(result);
                    }
                } catch {
                    await destroy();
                }
            });

            invocations.push({ name: 'Open', info: `Request URL: ${request.url}`});
            await win.Open(request, this.featureFlags.VerboseFetchWindow.Value, preload);
        });
    }
}