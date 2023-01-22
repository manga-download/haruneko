import type { IWindowController } from './WindowController';

export class WindowControllerBrowser implements IWindowController {

    public get HasControls() {
        return false;
    }

    public Minimize(): void {
        //
    }

    public Maximize(): void {
        //
    }

    public Restore(): void {
        //
    }

    public Close(): void {
        //
    }
}