export interface IWindowController {
    Minimize(): void;
    Maximize(): void;
    Restore(): void;
    Close(): void;
}

export class WindowController implements IWindowController {

    private readonly _win: NWJS_Helpers.win;

    constructor(nwWindow: NWJS_Helpers.win) {
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