import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitAppWindow from './nw/AppWindow';
import ElectronAppWindow from './electron/AppWindow';
import { GetLocale } from '../../i18n/Localization';
import GetIPC from './InterProcessCommunication';

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
        .Configure(Runtime.Electron, () => new ElectronAppWindow(GetIPC(), splashURL))
        .Create();
}

export function ReloadAppWindow(force = false): void {
    if(force || confirm(GetLocale().FrontendController_Reload_ConfirmNotice())) {
        window.location.reload();
    }
}