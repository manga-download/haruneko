import type { IPC } from '../InterProcessCommunication';
import { Observable, type IObservable } from '../../Observable';
import type { IAppWindow } from '../AppWindow';
import { GetIPC } from './InterProcessCommunication';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunication';

export default class implements IAppWindow {

    private readonly ipc = GetIPC();

    constructor (private readonly splashURL: string) {
        // TODO: Confirm really want to close => window.on('beforunload', ...)

        // TODO: Provisional fullscreen detection needs to be improved (e.g., via IPC BrowserWindow.on('move')) ...
        setInterval(this.#DetectMaximized.bind(this), 250);
    }

    public async ShowSplash(): Promise<void> {
        await this.ipc.Send(Channels.ApplicationWindow.HideWindow);
        await this.ipc.Send(Channels.ApplicationWindow.ShowWindow, this.splashURL);
    }

    public async HideSplash(): Promise<void> {
        await this.ipc.Send(Channels.ApplicationWindow.CloseSplash, this.splashURL);
        await this.ipc.Send(Channels.ApplicationWindow.ShowWindow);
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
        this.ipc.Send(Channels.ApplicationWindow.Minimize);
    }

    public Maximize(): void {
        this.ipc.Send(Channels.ApplicationWindow.Maximize);
    }

    public Restore(): void {
        this.ipc.Send(Channels.ApplicationWindow.Restore);
    }

    public Close(): void {
        this.ipc.Send(Channels.ApplicationWindow.Close);
    }
}