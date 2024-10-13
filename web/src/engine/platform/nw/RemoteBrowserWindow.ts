import { Observable, type IObservable } from '../../Observable';
import type { IRemoteBrowserWindow } from '../RemoteBrowserWindow';
import type { ScriptInjection } from '../FetchProviderCommon';

export default class RemoteBrowserWindow implements IRemoteBrowserWindow {

    private nwWindow: NWJS_Helpers.win = undefined;
    private nwDebugTarget: { tabId?: number } = undefined;

    private readonly domReady = new Observable<void, RemoteBrowserWindow>(null, this);
    public get DOMReady(): IObservable<void, RemoteBrowserWindow> {
        return this.domReady;
    };

    private readonly beforeWindowNavigate = new Observable<URL, RemoteBrowserWindow>(null, this);
    public get BeforeWindowNavigate(): IObservable<URL, RemoteBrowserWindow> {
        return this.beforeWindowNavigate;
    };

    private readonly beforeFrameNavigate = new Observable<URL, RemoteBrowserWindow>(null, this);
    public get BeforeFrameNavigate(): IObservable<URL, RemoteBrowserWindow> {
        return this.beforeFrameNavigate;
    };

    private async OnDomReady(frame: Window): Promise<void> {
        if(this.nwWindow.window === frame) {
            await this.domReady.Dispatch();
        }
    }

    private async OnBeforeNavigate(frame: Window, url: string): Promise<void> {
        if(url.startsWith('http')) {
            if(this.nwWindow.window === frame) {
                this.beforeWindowNavigate.Value = new URL(url);
            } else {
                this.beforeFrameNavigate.Value = new URL(url);
            }
        }
    }

    public async Open(request: Request, show: boolean = false, preload: ScriptInjection<void> = '') {

        const options: NWJS_Helpers.WindowOpenOption = {
            new_instance: false, // TODO: Would be safer when set to TRUE, but this would prevent sharing cookies ...
            show: show, // this.featureFlags.VerboseFetchWindow.Value,
            position: 'center',
            width: 1280,
            height: 800,
            //inject_js_start: 'filename'
            //inject_js_end: 'filename'
        };

        this.nwWindow = await new Promise<NWJS_Helpers.win>(resolve => nw.Window.open(request.url, options, resolve));

        /*
        if(!this.nwWindow.window?.document) {
            console.warn('New Browser Window has no DOM!');
        }

        if(this.nwWindow.window === nw.Window.get().window) {
            console.warn('New Browser Window has the same DOM as the Application Browser Window!');
        }
        */

        // NOTE: Use policy to prevent any new popup windows
        this.nwWindow.on('new-win-policy', (_frame, _url, policy) => {
            policy.ignore();
        });

        this.nwWindow.on('navigation', (frame, url) => this.OnBeforeNavigate(frame, url));

        //this.nwWindow.on('loaded', () => this.OnDomReady(this.nwWindow.window));

        this.nwWindow.on('document-start', (frame: Window) => {
            this.ExecuteScript(preload);
            if (this.nwWindow.window.document.readyState !== 'loading') {
                this.OnDomReady(frame);
            } else {
                this.nwWindow.window.document.addEventListener('DOMContentLoaded', () => this.OnDomReady(frame));
            }
        });

        /*
        export function PreventDialogs(nwWindow: NWJS_Helpers.win, frame: Window): void {
            if(frame.location.origin.startsWith('http')) {
                //console.log(`<INJECT-DOM-PREPERATION src="${frame.location.href}">`);
                nwWindow.window.window.opener = (() => protect(nwWindow, undefined))();
                nwWindow.window.window.open = (() => protect(nwWindow, proxify(window.open, { closed: false })))();
                nwWindow.window.window.confirm = (() => protect(nwWindow, proxify(window.confirm, true)))();
                nwWindow.window.window.prompt = (() => protect(nwWindow, proxify(window.prompt, '')))();
                nwWindow.window.window.alert = (() => protect(nwWindow, proxify(window.alert, undefined)))();
                //console.log('</INJECT-DOM-PREPERATION>');
            }
        }
        */
    }

    public async Close(): Promise<void> {
        if(this.nwDebugTarget) {
            await chrome.debugger.detach(this.nwDebugTarget);
        }
        this.nwWindow?.removeAllListeners();
        this.nwWindow?.close();
    }

    public async Show(): Promise<void> {
        this.nwWindow?.show();
    }

    public async Hide(): Promise<void> {
        this.nwWindow?.hide();
    }

    public async ExecuteScript<T extends void | JSONElement>(script: ScriptInjection<T> = ''): Promise<T> {
        try {
            return this.nwWindow.eval(null, script instanceof Function ? `(${script})()` : script) as T | Promise<T>;
        } catch(inner) {
            const outer = new EvalError('<script>', { cause: inner });
            //console.error(inner, outer);
            throw outer;
        }
    }

    public async SendDebugCommand<T extends void | JSONElement>(method: string, parameters?: JSONObject): Promise<T> {
        if(!this.nwDebugTarget) {
            this.nwDebugTarget = await new Promise((resolve, reject) => {
                chrome.debugger.getTargets(async targets => {
                    try {
                        const target = { tabId: targets.find(target => target.type === 'page' && target.url === this.nwWindow.window.location.href).tabId };
                        await chrome.debugger.attach(target, '1.3');
                        resolve(target);
                    } catch(error) {
                        reject(error);
                    }
                });
            });
        }
        return new Promise<T>(async resolve => {
            chrome.debugger.sendCommand(this.nwDebugTarget, method, parameters, result => resolve(result as T));
        });
    }
}