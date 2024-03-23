import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitAppWindow from './nw/AppWindow';

export interface IAppWindow {
    /**
     * Hide the application window and show the loading splash screen.
     */
    ShowSplash(): Promise<void>;
    /**
     * Show the application window and hide the loading splash screen.
     */
    HideSplash(): Promise<void>;
    readonly HasControls: boolean;
    Minimize(): void;
    Maximize(): void;
    Restore(): void;
    Close(): void;
}

export function CreateAppWindow(splashURL: string): IAppWindow {
    return new PlatformInstanceActivator<IAppWindow>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitAppWindow(nw.Window.get(), splashURL))
        .Create();
}