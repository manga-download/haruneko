import path from 'node:path';
import { app, BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { argvPreloadScript } from './RemoteBrowserWindowPreload';
import type { IPC } from './InterProcessCommunication';
import { RemoteBrowserWindowController as Channels } from '../../../src/ipc/Channels';

export class RemoteBrowserWindowController {

    constructor (private readonly ipc: IPC<Channels.Web, Channels.App>) {
        this.ipc.Listen(Channels.App.OpenWindow, this.OpenWindow.bind(this));
        this.ipc.Listen(Channels.App.CloseWindow, this.CloseWindow.bind(this));
        this.ipc.Listen(Channels.App.SetVisibility, this.SetVisibility.bind(this));
        this.ipc.Listen(Channels.App.ExecuteScript, this.ExecuteScript.bind(this));
        this.ipc.Listen(Channels.App.LoadURL, this.LoadURL.bind(this));
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
        win.webContents.on('dom-ready', () => this.ipc.Send(Channels.Web.OnDomReady, win.id));
        win.webContents.on('did-start-navigation', event => this.ipc.Send(Channels.Web.OnBeforeNavigate, win.id, event.url, event.isMainFrame, event.isSameDocument));
        return win.id;
    }

    private async CloseWindow(windowID: number): Promise<void> {
        this.FindWindow(windowID).destroy();
    }

    private async SetVisibility(windowID: number, show: boolean): Promise<void> {
        const win = this.FindWindow(windowID);
        return show ? win.show() : win.hide();
    }

    private async ExecuteScript<T extends JSONElement>(windowID: number, script: string): Promise<T> {
        return this.FindWindow(windowID).webContents.executeJavaScript(script, true);
    }

    private async LoadURL(windowID: number, url: string, options: string): Promise<void> {
        await this.FindWindow(windowID).loadURL(url, JSON.parse(options));
    }
}