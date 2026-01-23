import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { type IPC, Channels } from './InterProcessCommunication';

export class ApplicationWindow extends BrowserWindow {

    private splash?: BrowserWindow = null;

    public async RegisterChannels(ipc: IPC) {
        // TODO: Prevent duplicate registrations
        ipc.Handle(Channels.ApplicationWindow.ShowWindow, super.show.bind(this));
        ipc.Handle(Channels.ApplicationWindow.HideWindow, super.hide.bind(this));
        ipc.Handle(Channels.ApplicationWindow.Minimize, super.minimize.bind(this));
        ipc.Handle(Channels.ApplicationWindow.Maximize, super.maximize.bind(this));
        ipc.Handle(Channels.ApplicationWindow.Restore, super.restore.bind(this));
        ipc.Handle(Channels.ApplicationWindow.Close, super.close.bind(this));
        ipc.Handle(Channels.ApplicationWindow.OpenSplash, this.OpenSplash.bind(this));
        ipc.Handle(Channels.ApplicationWindow.CloseSplash, this.CloseSplash.bind(this));
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