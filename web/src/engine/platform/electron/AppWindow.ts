import type { IAppWindow } from '../AppWindow';
import { GetIPC } from './InterProcessCommunication';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunication';

export default class implements IAppWindow {

    private readonly ipc = GetIPC();

    constructor (private readonly splashURL: string) {
        // TODO: Confirm really want to close => window.on('beforunload', ...)
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