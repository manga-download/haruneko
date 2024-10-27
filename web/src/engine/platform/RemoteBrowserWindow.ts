import type { IObservable } from '../Observable';
import type { ScriptInjection } from './FetchProviderCommon';
import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitRemoteBrowserWindow from './nw/RemoteBrowserWindow';
import ElectronRemoteBrowserWindow from './electron/RemoteBrowserWindow';
import GetIPC from './InterProcessCommunication';

export interface IRemoteBrowserWindow {
    get DOMReady(): IObservable<void, IRemoteBrowserWindow>;
    get BeforeWindowNavigate(): IObservable<URL, IRemoteBrowserWindow>;
    get BeforeFrameNavigate(): IObservable<URL, IRemoteBrowserWindow>;
    Open(request: Request, show: boolean, preload: ScriptInjection<void>): Promise<void>;
    Close(): Promise<void>;
    Show(): Promise<void>;
    Hide(): Promise<void>;
    /**
     * Evaluate the given {@link script} and return the result from the last instruction.
     */
    ExecuteScript<T extends void | JSONElement>(script: ScriptInjection<T>): Promise<T>;
    /**
     * Send chrome debug protocol commands.
     * @see https://chromedevtools.github.io/devtools-protocol/1-3/
     */
    SendDebugCommand<T extends void | JSONElement>(method: string, parameters?: JSONObject): Promise<T>;
}

export function CreateRemoteBrowserWindow(): IRemoteBrowserWindow {
    return new PlatformInstanceActivator<IRemoteBrowserWindow>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitRemoteBrowserWindow())
        .Configure(Runtime.Electron, () => new ElectronRemoteBrowserWindow(GetIPC()))
        .Create();
}