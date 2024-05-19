import type { BrowserWindowConstructorOptions, LoadURLOptions } from 'electron';
import { Exception } from '../../Error';
import type { FeatureFlags } from '../../FeatureFlags';
import { EngineResourceKey as R } from '../../../i18n/ILocale';
import { FetchProvider, type ScriptInjection } from '../FetchProviderCommon';
import { FetchRedirection } from '../AntiScrapingDetection';
import { CheckAntiScrapingDetection } from './AntiScrapingDetection';

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

    private readonly dbg: Record<number, (id: number) => Promise<void>> = {};

    constructor(private readonly featureFlags: FeatureFlags) {
        super();
    }

    public Initialize(): void {

        // Abuse the global Request type to check if system is already initialized
        if(globalThis.Request === FetchRequest) {
            return;
        }

        // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
        globalThis.Request = FetchRequest;

        globalThis.ipcRenderer.invoke('FetchProvider::Initialize', fetchApiSupportedPrefix);
        globalThis.ipcRenderer.on('RemoteBrowserWindowController::OnDomReady', (_, windowID) => this.dbg[windowID]?.call(this, windowID));
    }

    async Fetch(request: Request): Promise<Response> {
        console.log('Platform::Electron::FetchProvider::Fetch()', '=>', request);
        return fetch(request);
    }

    private async OpenRemoteWindow(request: Request, preload: ScriptInjection<void>) {
        const openOptions: BrowserWindowConstructorOptions = {
            show: this.featureFlags.VerboseFetchWindow.Value,
            width: 1280,
            height: 720,
            webPreferences: {
                preload: preload instanceof Function ? `(${preload})()` : preload,
                webSecurity: true,
                contextIsolation: true,
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                nodeIntegrationInSubFrames: false,
                disableBlinkFeatures: 'AutomationControlled',
            }
        };

        const windowID = await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::OpenWindow', JSON.stringify(openOptions)) as number;

        if(windowID) {
            return windowID;
        } else {
            throw new Error('[I18N] - Failed to open Browser Window!');
        }
    }

    public async FetchWindowScript<T>(request: Request, script: ScriptInjection<T>, delay?: number, timeout?: number): Promise<T> {
        console.warn('Platform::Electron::FetchProvider::FetchWindowScript()', '=>', request, script, delay, timeout);
        return this.FetchWindowPreloadScript<T>(request, () => undefined, script, delay, timeout);
    }

    public async FetchWindowPreloadScript<T>(request: Request, preload: ScriptInjection<void>, script: ScriptInjection<T>, delay: number = 0, timeout: number = 60_000): Promise<T> {

        const loadOptions: LoadURLOptions = {
            userAgent: request.headers.get('User-Agent') ?? navigator.userAgent,
            httpReferrer: request.headers.get('Referer') ?? request.referrer ?? request.url,
        };

        return new Promise<T>(async (resolve, reject) => {

            const invocations: {
                name: string;
                info: string
            }[] = [];

            const windowID = await this.OpenRemoteWindow(request, preload);

            const destroy = async (id: number/*, error: Error*/) => {
                try {
                    delete this.dbg[windowID];
                    if(this.featureFlags.VerboseFetchWindow.Value) {
                        console.log('FetchWindow()::invocations', invocations);
                    } else {
                        await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::CloseWindow', id);
                    }
                } catch(error) {
                    console.warn(error);
                } finally {
                    reject(error);
                }
            };

            let cancellation = setTimeout(() => destroy(windowID, new Exception(R.FetchProvider_FetchWindow_TimeoutError)), timeout);

            // TODO: Hide window on navigation
            //await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::SetVisibility', windowID, false);

            // TODO: Find more appropriate way to register DOM-Ready callback
            this.dbg[windowID] = async (id) => {
                invocations.push({ name: 'DOMReady', info: `Window: ${id}/${windowID}` });
                if(id !== windowID) {
                    return;
                }

                try {
                    const redirect = await CheckAntiScrapingDetection(windowID);
                    invocations.push({ name: 'performRedirectionOrFinalize()', info: `Mode: ${FetchRedirection[redirect]}`});
                    switch (redirect) {
                        case FetchRedirection.Interactive:
                            // NOTE: Allow the user to solve the captcha within 2.5 minutes before rejecting the request with an error
                            clearTimeout(cancellation);
                            cancellation = setTimeout(() => destroy(windowID, new Exception(R.FetchProvider_FetchWindow_TimeoutError)), 150_000);
                            await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::SetVisibility', windowID, true);
                            break;
                        case FetchRedirection.Automatic:
                            break;
                        default:
                            clearTimeout(cancellation);
                            await super.Wait(delay);
                            const result: T = await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::ExecuteScript', windowID, script instanceof Function ? `(${script})()` : script);
                            console.log('FetchWindowPreloadScript()', 'Result =>', result);
                            await destroy(windowID, null);
                            resolve(result);
                    }
                } catch(error) {
                    await destroy(windowID, error);
                }
            };
            invocations.push({ name: 'RemoteBrowserWindowController::LoadURL()', info: `Request URL: ${request.url}`});
            await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::LoadURL', windowID, request.url, JSON.stringify(loadOptions));
        });
    }
}