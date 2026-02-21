import type { IPC } from '../InterProcessCommunication';
import { Observable, type IObservable } from '../../Observable';
import type { IAppWindow } from '../AppWindow';
import { ApplicationWindow as Channels } from '../../../../../app/src/ipc/Channels';

export default class implements IAppWindow {

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>, private readonly splashURL: string) {
        // TODO: Confirm really want to close => window.on('beforunload', ...)

        // TODO: Provisional fullscreen detection needs to be improved (e.g., via IPC BrowserWindow.on('move')) ...
        setInterval(this.#DetectMaximized.bind(this), 250);
    }

    public async ShowSplash(): Promise<void> {
        await this.ipc.Send(Channels.App.HideWindow);
        await this.ipc.Send(Channels.App.ShowWindow, this.splashURL);
    }

    public async HideSplash(): Promise<void> {
        await this.ipc.Send(Channels.App.CloseSplash, this.splashURL);
        await this.ipc.Send(Channels.App.ShowWindow);
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
        this.ipc.Send(Channels.App.Minimize);
    }

    public Maximize(): void {
        this.ipc.Send(Channels.App.Maximize);
    }

    public Restore(): void {
        this.ipc.Send(Channels.App.Restore);
    }

    public Close(): void {
        this.ipc.Send(Channels.App.Close);
    }
}