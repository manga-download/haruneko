import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { RemoteBrowserWindowController as Channels } from '../../../src/ipc/Channels';

export class RemoteBrowserWindowController {

    constructor (private readonly ipc: IPC<Channels.Web, Channels.App>) {
        this.ipc.Listen(Channels.App.OpenWindow, this.OpenWindow.bind(this));
        this.ipc.Listen(Channels.App.CloseWindow, this.CloseWindow.bind(this));
        this.ipc.Listen(Channels.App.SetVisibility, this.SetVisibility.bind(this));
        this.ipc.Listen(Channels.App.ExecuteScript, this.ExecuteScript.bind(this));
        this.ipc.Listen(Channels.App.SendDebugCommand, this.SendDebugCommand.bind(this));
        this.ipc.Listen(Channels.App.LoadURL, this.LoadURL.bind(this));
    }

    private Throw<T>(message: string): T {
        throw new Error(message);
    }

    private FindWindow(windowID: number): BrowserWindow {
        return BrowserWindow.fromId(windowID) ?? this.Throw(`Failed to find window with id ${windowID}!`);
    }

    private async CreatePreloadScriptFile(content: string): Promise<string> {
        const file = path.resolve(os.tmpdir(), Date.now().toString(36) + Math.random().toString(36));
        await fs.writeFile(file, content);
        return file;
    }

    private async OpenWindow(options: string): Promise<number> {
        const windowOptions: BrowserWindowConstructorOptions = JSON.parse(options);
        if (windowOptions.webPreferences?.preload) {
            windowOptions.webPreferences.preload = await this.CreatePreloadScriptFile(windowOptions.webPreferences.preload);
        }
        const win = new BrowserWindow(windowOptions);
        win.autoHideMenuBar = true;
        win.setMenuBarVisibility(false);
        win.webContents.debugger.attach('1.3');
        win.webContents.setWindowOpenHandler(() => { return { action: 'deny' }; });
        win.webContents.on('dom-ready', () => this.ipc.Send(Channels.Web.OnDomReady, win.id));
        win.webContents.on('did-start-navigation', event => this.ipc.Send(Channels.Web.OnBeforeNavigate, win.id, event.url, event.isMainFrame, event.isSameDocument));
        win.once('closed', () => fs.rm(windowOptions.webPreferences?.preload).catch(err => console.warn(err)));
        return win.id;
    }

    private async CloseWindow(windowID: number): Promise<void> {
        const win = this.FindWindow(windowID);
        win.webContents.debugger.detach();
        win.destroy();
    }

    private async SetVisibility(windowID: number, show: boolean): Promise<void> {
        const win = this.FindWindow(windowID);
        return show ? win.show() : win.hide();
    }

    private async ExecuteScript<T extends JSONElement>(windowID: number, script: string): Promise<T> {
        return this.FindWindow(windowID).webContents.executeJavaScript(script, true);
    }

    private async SendDebugCommand<T extends void | JSONElement>(windowID: number, method: string, parameters?: JSONObject): Promise<T> {
        const remoteDebugger = this.FindWindow(windowID).webContents.debugger;
        if(remoteDebugger.isAttached()) {
            return remoteDebugger.sendCommand(method, parameters) as Promise<T>;
        } else {
            this.Throw(`The debugger is not attached to the window with id ${windowID}!`);
        }
    }

    private async LoadURL(windowID: number, url: string, options: string): Promise<void> {
        await this.FindWindow(windowID).loadURL(url, JSON.parse(options));
    }
}