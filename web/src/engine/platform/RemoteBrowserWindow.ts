import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitRemoteBrowserWindow from './nw/RemoteBrowserWindow';
import ElectronRemoteBrowserWindow from './electron/RemoteBrowserWindow';
import GetIPC from './InterProcessCommunication';
import type { IObservable } from '../Observable';
import type { ScriptInjection } from './FetchProviderCommon';

export interface IRemoteBrowserWindow {
    get DOMReady(): IObservable<void, IRemoteBrowserWindow>;
    get BeforeWindowNavigate(): IObservable<URL, IRemoteBrowserWindow>;
    get BeforeFrameNavigate(): IObservable<URL, IRemoteBrowserWindow>;
    Open(request: Request, show: boolean, preload: ScriptInjection<void>): Promise<void>;
    Close(): Promise<void>;
    Show(): Promise<void>;
    Hide(): Promise<void>;
    ExecuteScript<T extends void | JSONElement>(script: ScriptInjection<T>): Promise<T>;
}

export function CreateRemoteBrowserWindow(): IRemoteBrowserWindow {
    return new PlatformInstanceActivator<IRemoteBrowserWindow>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitRemoteBrowserWindow())
        .Configure(Runtime.Electron, () => new ElectronRemoteBrowserWindow(GetIPC()))
        .Create();
}