import type { IAppWindow } from '../AppWindow';

export default class implements IAppWindow {

    private nwSplash: NWJS_Helpers.win;
    private readonly nwSplashOptions: NWJS_Helpers.WindowOpenOption = {
        new_instance: true,
        frame: false,
        transparent: true,
        show: false,
        position: 'center',
        width: 416,
        height: 520
    };

    constructor(private readonly nwWindow: NWJS_Helpers.win, private readonly splashURL: string) {
        // TODO: Confirm really want to close => nwWindow.on('beforunload', ...)
        this.RegisterKeyboardShortcuts();
    }

    private RegisterKeyboardShortcuts() {
        nw.App.registerGlobalHotKey(new nw.Shortcut({
            key: 'F11',
            active: function () {
                this.nwWindow.toggleFullscreen();
            },
            failed: () => { console.log('F11 failed'); }
        }));
    }

    private async InitializeSplash(): Promise<void> {
        if(this.nwSplash) {
            return;
        }
        this.nwSplash = await new Promise<NWJS_Helpers.win>(resolve => {
            nw.Window.open(this.splashURL, this.nwSplashOptions, (popup: NWJS_Helpers.win) => {
                popup.on('closed', () => {
                    this.nwWindow.show();
                    this.nwWindow.focus();
                });
                popup.focus();
                resolve(popup);
            });
        });
    }

    public async ShowSplash() {
        await this.InitializeSplash();
        this.nwWindow.hide();
        this.nwSplash.show();
    }

    public async HideSplash() {
        await this.InitializeSplash();
        this.nwSplash.close(true);
        this.nwWindow.show();
    }

    public get HasControls() {
        return true;
    }

    public Minimize(): void {
        this.nwWindow.minimize();
    }

    public Maximize(): void {
        this.nwWindow.maximize();
    }

    public Restore(): void {
        this.nwWindow.restore();
    }

    public Close(): void {
        this.nwWindow.close();
    }
}