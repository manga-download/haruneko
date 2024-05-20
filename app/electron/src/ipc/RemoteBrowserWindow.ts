import path from 'node:path';
import { app, BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { argvPreloadScript } from './RemoteBrowserWindowPreload';
import type { IPC } from './InterProcessCommunication';

/**
 * Supported IPC Channels for interacting with browser windows.
 * @description Send from the Main process and received in the Render process.
 */
export enum RendererChannels {
    OnDomReady = 'Browser::OnDomReady',
    OnBeforeNavigate = 'Browser::OnBeforeNavigate',
};

/**
 * Supported IPC Channels for interacting with browser windows.
 * @description Send from the Render process and received in the Main process.
 */
export enum MainChannels {
    OpenWindow = 'Browser::OpenWindow(options: string)',
    CloseWindow = 'Browser::CloseWindow(windowID: number)',
    SetVisibility = 'Browser::SetVisibility(windowID: number, show: boolean)',
    ExecuteScript = 'Browser::ExecuteScript(windowID: number, script: string)',
    LoadURL = 'Browser::LoadURL(windowID: number, url: string, options: string)',
};

export class RemoteBrowserWindowController {

    constructor (private readonly ipc: IPC<RendererChannels, MainChannels>) {
        this.ipc.Listen(MainChannels.OpenWindow, this.OpenWindow.bind(this));
        this.ipc.Listen(MainChannels.CloseWindow, this.CloseWindow.bind(this));
        this.ipc.Listen(MainChannels.SetVisibility, this.SetVisibility.bind(this));
        this.ipc.Listen(MainChannels.ExecuteScript, this.ExecuteScript.bind(this));
        this.ipc.Listen(MainChannels.LoadURL, this.LoadURL.bind(this));
    }

    private Throw<T>(message: string): T {
        throw new Error(message);
    }

    private FindWindow(windowID: number): BrowserWindow {
        return BrowserWindow.fromId(windowID) ?? this.Throw(`Failed to find window with id ${windowID}!`);
    }

    private async OpenWindow(options: string): Promise<number> {
        const windowOptions: BrowserWindowConstructorOptions = JSON.parse(options);
        if (windowOptions.webPreferences?.preload) {
            windowOptions.webPreferences.additionalArguments = [ `${argvPreloadScript}${btoa(windowOptions.webPreferences.preload)}` ];
            windowOptions.webPreferences.preload = path.resolve(app.getAppPath(), 'remotebrowserwindowpreload.js');
        }
        const win = new BrowserWindow(windowOptions);
        win.removeMenu();
        win.setMenu(null);
        win.setMenuBarVisibility(false);
        win.webContents.setWindowOpenHandler(() => {
            return { action: 'deny' };
        });
        win.webContents.on('dom-ready', (event: unknown) => this.ipc.Send(RendererChannels.OnDomReady, win.id, JSON.stringify(event)));
        win.webContents.on('did-start-navigation', (event: unknown) => this.ipc.Send(RendererChannels.OnBeforeNavigate, win.id, JSON.stringify(event)));
        return win.id;
    }

    private async CloseWindow(windowID: number): Promise<void> {
        this.FindWindow(windowID).destroy();
    }

    private async SetVisibility(windowID: number, show: boolean): Promise<void> {
        const win = this.FindWindow(windowID);
        return show ? win.show() : win.hide();
    }

    private async ExecuteScript<T>(windowID: number, script: string): Promise<T> {
        return this.FindWindow(windowID).webContents.executeJavaScript(script, true);
    }

    private async LoadURL(windowID: number, url: string, options: string): Promise<void> {
        await this.FindWindow(windowID).loadURL(url, JSON.parse(options));
    }
}