import type { IWindowController } from './WindowController';

export class WindowControllerNodeWebkit implements IWindowController {

    readonly #win: NWJS_Helpers.win;

    constructor(nwWindow: NWJS_Helpers.win) {
        this.#win = nwWindow;
    }

    public get HasControls() {
        return true;
    }

    public Minimize(): void {
        this.#win.minimize();
    }

    public Maximize(): void {
        this.#win.maximize();
    }

    public Restore(): void {
        this.#win.restore();
    }

    public Close(): void {
        this.#win.close();
    }
}