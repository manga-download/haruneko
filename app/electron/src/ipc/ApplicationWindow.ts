import { BrowserWindow } from 'electron';
import type { IPC, Callback } from './InterProcessCommunication';
import { ApplicationWindow as Channels } from '../../../src/ipc/Channels';

export class ApplicationWindow extends BrowserWindow {

    private splash?: BrowserWindow = undefined;

    public async RegisterChannels(ipc: IPC<Channels.Web, Channels.App>) {
        // TODO: Prevent duplicate registrations
        ipc.Listen(Channels.App.ShowWindow, super.show.bind(this) as Callback);
        ipc.Listen(Channels.App.HideWindow, super.hide.bind(this) as Callback);
        ipc.Listen(Channels.App.Minimize, super.minimize.bind(this) as Callback);
        ipc.Listen(Channels.App.Maximize, super.maximize.bind(this) as Callback);
        ipc.Listen(Channels.App.Restore, this.Restore.bind(this) as Callback);
        ipc.Listen(Channels.App.Close, super.close.bind(this) as Callback);
        ipc.Listen(Channels.App.OpenSplash, this.OpenSplash.bind(this) as Callback);
        ipc.Listen(Channels.App.CloseSplash, this.CloseSplash.bind(this) as Callback);
    }

    private async Restore() {
        if (super.isMinimized()) super.restore();
        if (super.isMaximized()) super.unmaximize();
    }

    private async OpenSplash(url: string) {
        if(!this.splash) {
            this.splash = new BrowserWindow({
                width: 416,
                height: 520,
                center: true,
                frame: false,
                transparent: true,
                webPreferences: {
                    webSecurity: true,
                    nodeIntegration: false,
                    contextIsolation: true,
                    allowRunningInsecureContent: false,
                },
            });
            this.splash.removeMenu();
            this.splash.setMenu(null);
            this.splash.setMenuBarVisibility(false);
            this.splash.on('closed', () => super.show());
        }
        return this.splash?.loadURL(url);
    }

    private async CloseSplash() {
        this.splash?.close();
    }
}