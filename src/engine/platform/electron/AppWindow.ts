import type { IPC } from '../InterProcessCommunication';
import type { IAppWindow } from '../AppWindow';
import { ApplicationWindow as Channels } from '../../../../../app/src/ipc/Channels';

export default class implements IAppWindow {

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>, private readonly splashURL: string) {
        // TODO: Confirm really want to close => window.on('beforunload', ...)
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