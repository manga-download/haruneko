import type { IAppWindow } from '../AppWindow';

export default class implements IAppWindow {

    constructor(private readonly splashURL: string) {}

    public async ShowSplash(): Promise<void> {
        await globalThis.ipcRenderer.invoke('IAppWindow::HideWindow');
        await globalThis.ipcRenderer.invoke('IAppWindow::OpenSplash', this.splashURL);
    }

    public async HideSplash(): Promise<void> {
        await globalThis.ipcRenderer.invoke('IAppWindow::CloseSplash', this.splashURL);
        await globalThis.ipcRenderer.invoke('IAppWindow::ShowWindow');
    }

    public get HasControls() {
        return true;
    }

    public Minimize(): void {
        globalThis.ipcRenderer.invoke('IAppWindow::Minimize');
    }

    public Maximize(): void {
        globalThis.ipcRenderer.invoke('IAppWindow::Maximize');
    }

    public Restore(): void {
        globalThis.ipcRenderer.invoke('IAppWindow::Restore');
    }

    public Close(): void {
        globalThis.ipcRenderer.invoke('IAppWindow::Close');
    }
}