import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitAppWindow from './nw/AppWindow';

export interface IAppWindow {
    ShowSplash(): Promise<void>;
    HideSplash(): Promise<void>;
    readonly HasControls: boolean;
    Minimize(): void;
    Maximize(): void;
    Restore(): void;
    Close(): void;
}

export function CreateAppWindow(splashURL: string, useSplash: boolean): IAppWindow {
    return new PlatformInstanceActivator<IAppWindow>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitAppWindow(nw.Window.get(), splashURL, useSplash))
        .Create();
}