import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import type { IPC } from './InterProcessCommunication';

/**
 * Supported IPC Channels for interacting with the RPC manager.
 * @description Send from the Main process and received in the Render process.
 */
export type RendererChannels = never;

/**
 * Supported IPC Channels for interacting with the RPC manager.
 * @description Send from the Render process and received in the Main process.
 */
export enum MainChannels {
    ShowWindow = 'ApplicationWindow::ShowWindow()',
    HideWindow = 'ApplicationWindow::HideWindow()',
    Minimize = 'ApplicationWindow::Minimize()',
    Maximize = 'ApplicationWindow::Maximize()',
    Restore = 'ApplicationWindow::Restore()',
    Close = 'ApplicationWindow::Close()',
    OpenSplash = 'ApplicationWindow::OpenSplash(url: string)',
    CloseSplash = 'ApplicationWindow::CloseSplash()',
};

export class ApplicationWindow extends BrowserWindow {

    private splash?: BrowserWindow = null;

    constructor(options: BrowserWindowConstructorOptions) {
        super(options);
    }

    public async RegisterChannels(ipc: IPC<RendererChannels, MainChannels>) {
        // TODO: Prevent duplicate registrations
        ipc.Listen(MainChannels.ShowWindow, super.show.bind(this));
        ipc.Listen(MainChannels.HideWindow, super.hide.bind(this));
        ipc.Listen(MainChannels.Minimize, super.minimize.bind(this));
        ipc.Listen(MainChannels.Maximize, super.maximize.bind(this));
        ipc.Listen(MainChannels.Restore, super.restore.bind(this));
        ipc.Listen(MainChannels.Close, super.close.bind(this));
        ipc.Listen(MainChannels.OpenSplash, this.OpenSplash.bind(this));
        ipc.Listen(MainChannels.CloseSplash, this.CloseSplash.bind(this));
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