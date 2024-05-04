import path from 'node:path';
import { app, ipcMain, BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { argvPreloadScript } from './RemoteBrowserWindowPreload';

export class RemoteBrowserWindowController {

    constructor () {
        ipcMain.handle('RemoteBrowserWindowController::OpenWindow', (_, options: string) => this.OpenWindow(options));
        ipcMain.handle('RemoteBrowserWindowController::CloseWindow', (_, windowID: number) => this.CloseWindow(windowID));
        ipcMain.handle('RemoteBrowserWindowController::SetVisibility', (_, windowID: number, show: true) => this.SetVisibility(windowID, show));
        ipcMain.handle('RemoteBrowserWindowController::ExecuteScript', (_, windowID: number, script: string) => this.ExecuteScript(windowID, script));
        ipcMain.handle('RemoteBrowserWindowController::LoadURL', (_, windowID: number, url: string, options: string) => this.LoadURL(windowID, url, options));
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