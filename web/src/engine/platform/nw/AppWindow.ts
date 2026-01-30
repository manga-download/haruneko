import { Observable, type IObservable } from '../../Observable';
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

        // TODO: Provisional fullscreen detection needs to be improved ...
        setInterval(this.#DetectMaximized.bind(this), 250);
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

    readonly #maximized = new Observable<boolean, IAppWindow>(false, this);
    public get Maximized(): IObservable<boolean, IAppWindow> {
        return this.#maximized;
    }

    #DetectMaximized() {
        this.#maximized.Value =
            window.screenX === window.screen.availLeft
            && window.screenY === window.screen.availTop
            && window.outerWidth === window.screen.availWidth
            && window.outerHeight === window.screen.availHeight;
        //console.log('Move to Maximum:', this.#maximized.Value, ':', window.screenX, window.screenY, window.outerWidth, window.outerHeight, 'x', window.screen.availLeft, window.screen.availTop, window.screen.availWidth, window.screen.availHeight);
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