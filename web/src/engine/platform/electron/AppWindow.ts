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
        this.#maximized.Value =
            window.screenX === window.screen.availLeft
            && window.screenY === window.screen.availTop
            && window.outerWidth === window.screen.availWidth
            && window.outerHeight === window.screen.availHeight;
        //console.log('Move to Maximum:', this.#maximized.Value, ':', window.screenX, window.screenY, window.outerWidth, window.outerHeight, 'x', window.screen.availLeft, window.screen.availTop, window.screen.availWidth, window.screen.availHeight);
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