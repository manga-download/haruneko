import { ipcMain, BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';

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
            // TODO: Prepare preload script
            delete windowOptions.webPreferences?.preload;
        }
        const win = new BrowserWindow(windowOptions);
        // TODO: Inherit cookies from main window?
        win.removeMenu();
        win.setMenu(null);
        win.setMenuBarVisibility(false);
        win.webContents.setWindowOpenHandler(() => {
            return { action: 'deny' };
        });
        return win.id;
    }

    private async CloseWindow(windowID: number) {
        this.FindWindow(windowID).destroy();
    }

    private async SetVisibility(windowID: number, show: boolean): Promise<void> {
        const win = this.FindWindow(windowID);
        return show ? win.show() : win.hide();
    }

    private async ExecuteScript(windowID: number, script: string): Promise<unknown> {
        return this.FindWindow(windowID).webContents.executeJavaScript(script, true);
    }

    private async LoadURL(windowID: number, url: string, options: string) {
        await this.FindWindow(windowID).loadURL(url, JSON.parse(options));
    }
}