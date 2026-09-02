import { Observable, type IObservable } from '../../Observable';
import type { IAppWindow } from '../AppWindow';
import { GetIPC } from './InterProcessCommunication';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunicationChannels';

export default class implements IAppWindow {

    private readonly ipc = GetIPC();

    constructor (private readonly splashURL: string) {
        // TODO: Confirm really want to close => window.on('beforunload', ...)

        // TODO: Provisional fullscreen detection needs to be improved (e.g., via IPC BrowserWindow.on('move')) ...
        setInterval(this.#DetectMaximized.bind(this), 500);
    }

    public async ShowSplash(): Promise<void> {
        this.ipc.Invoke(Channels.ApplicationWindow.HideWindow);
        this.ipc.Invoke(Channels.ApplicationWindow.OpenSplash, this.splashURL);
    }

    public async HideSplash(): Promise<void> {
        this.ipc.Invoke(Channels.ApplicationWindow.CloseSplash);
        this.ipc.Invoke(Channels.ApplicationWindow.ShowWindow);
    }

    public get HasControls() {
        return true;
    }

    readonly #maximized = new Observable<boolean, IAppWindow>(null, this);
    public get Maximized(): IObservable<boolean, IAppWindow> {
        return this.#maximized;
    }

    #DetectMaximized() {
        const screen = window.screen as Screen & { availLeft?: number, availTop?: number };
        this.#maximized.Value =
            window.screenX === screen.availLeft
            && window.screenY === screen.availTop
            && window.outerWidth === screen.availWidth
            && window.outerHeight === screen.availHeight;
    }

    public Minimize(): void {
        this.ipc.Invoke(Channels.ApplicationWindow.Minimize);
    }

    public Maximize(): void {
        this.ipc.Invoke(Channels.ApplicationWindow.Maximize);
    }

    public Restore(): void {
        this.ipc.Invoke(Channels.ApplicationWindow.Restore);
    }

    public Close(): void {
        this.ipc.Invoke(Channels.ApplicationWindow.Close);
    }
}