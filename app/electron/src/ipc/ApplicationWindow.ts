import { ipcMain, BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';

export class ApplicationWindow extends BrowserWindow {

    constructor(options: BrowserWindowConstructorOptions) {
        super(options);
        ipcMain.handle('IAppWindow::ShowWindow', () => this.show());
        ipcMain.handle('IAppWindow::HideWindow', () => this.hide());
        ipcMain.handle('IAppWindow::OpenSplash', (_, url: string) => this.OpenSplash(url));
        ipcMain.handle('IAppWindow::CloseSplash', (_, url: string) => this.CloseSplash(url));
        ipcMain.handle('IAppWindow::Minimize', () => this.minimize());
        ipcMain.handle('IAppWindow::Maximize', () => this.maximize());
        ipcMain.handle('IAppWindow::Restore', () => this.restore());
        ipcMain.handle('IAppWindow::Close', () => this.close());
    }

    private async OpenSplash(url: string) {
        if(BrowserWindow.getAllWindows().some(win => win.webContents.getURL() === url)) {
            return;
        }
        const splash = new BrowserWindow({
            width: 416,
            height: 520,
            center: true,
            frame: false,
            transparent: false,
            webPreferences: {
                webSecurity: true,
                nodeIntegration: false,
                contextIsolation: true,
                allowRunningInsecureContent: false,
            },
        });
        splash.removeMenu();
        splash.setMenu(null);
        splash.setMenuBarVisibility(false);
        splash.on('closed', () => this.show());
        return splash.loadURL(url);
    }

    private async CloseSplash(url: string) {
        BrowserWindow.getAllWindows().filter(win => win.webContents.getURL() === url).forEach(win => win.close());
    }
}