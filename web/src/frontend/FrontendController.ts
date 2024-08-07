import type { IFrontendInfo } from './IFrontend';
import { Info as InfoClassic } from './classic/FrontendInfo';
import { Info as InfoFluentCore } from './fluent-core/FrontendInfo';
import type { Choice, ISettings } from '../engine/SettingsManager';
import { Key } from '../engine/SettingsGlobal';
import { ReloadAppWindow, type IAppWindow } from '../engine/platform/AppWindow';
import { Observable, type IObservable } from '../engine/Observable';

export const FrontendList: IFrontendInfo[] = [
    InfoClassic,
    InfoFluentCore,
];

export class FrontendController {

    private readonly settingSelectedFrontend: Choice;
    private readonly currentFrontendInfo = new Observable<IFrontendInfo>(null);
    public get CurrentFrontendInfo(): IObservable<IFrontendInfo, null> {
        return this.currentFrontendInfo;
    }

    constructor(root: HTMLElement, settings: ISettings, private readonly appWindow: IAppWindow) {
        this.settingSelectedFrontend = settings.Get<Choice>(Key.Frontend);
        this.settingSelectedFrontend.Subscribe(value => this.currentFrontendInfo.Value.ID !== value ? ReloadAppWindow() : undefined);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.Load(root), { once: true });
        } else {
            this.Load(root);
        }
    }

    private async Load(hook: HTMLElement): Promise<void> {
        try {
            const info = FrontendList.find(info => info.ID === this.settingSelectedFrontend.Value) ?? FrontendList.first();
            const frontend = await info.LoadModule();
            hook.replaceChildren();
            await frontend.Render(hook, this.appWindow);
            this.currentFrontendInfo.Value = info;
        } catch(error) {
            console.error('Failed to load frontend!', error);
        }
    }
}