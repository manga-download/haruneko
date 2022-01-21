import type { IEvent } from "./EventManager";

export interface IWindowController {
    Minimize(): void;
    Maximize(): void;
    Restore(): void;
    Close(): void;
}

export class WindowController implements IWindowController {

    private readonly _win: any; // NWWindow

    constructor(nwWindow: any) {
        this._win = nwWindow;
    }

    public Minimize(): void {
        this._win.minimize();
    }

    public Maximize(): void {
        this._win.maximize();
    }

    public Restore(): void {
        this._win.restore();
    }

    public Close(): void {
        this._win.close();
    }
}