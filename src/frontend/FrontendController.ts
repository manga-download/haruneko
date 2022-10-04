import { GetLocale } from '../i18n/Localization';
import { Event } from '../engine/Event';
import type { IFrontendInfo, IFrontendModule } from './IFrontend';
import { Info as InfoClassic } from './classic/FrontendInfo';
import { Info as InfoFluentCore } from './fluent-core/FrontendInfo';
import { CreateWindowController } from './WindowController';
import type { Choice, ISettings } from '../engine/SettingsManager';
import { Key } from '../engine/SettingsGlobal';

const frontendSelector = '#app';
export const FrontendList: IFrontendInfo[] = [
    InfoClassic,
    InfoFluentCore
];

export class FrontendController {

    private activeFrontendID = '';
    public static readonly FrontendLoaded = new Event<IFrontendModule, IFrontendInfo>();

    constructor(private readonly settings: ISettings) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.Load);
        } else {
            this.Load();
        }
        this.settings.Get<Choice>(Key.Frontend).ValueChanged.Subscribe((_, value) => this.Reload(value));
    }

    private GetSettingsFrontendID(): string | null {
        const frontendID = this.settings.Get<Choice>(Key.Frontend).Value;
        return FrontendList.some(frontend => frontend.ID === frontendID) ? frontendID : null;
    }

    private GetFrontendInfoByID(id: string): IFrontendInfo {
        const info = FrontendList.find(item => item.ID === id);
        if(info) {
            return info;
        } else {
            throw new Error(`The frontend information could not be found in the list of available frontends!`);
        }
    }

    private async GetFrontendModuleByID(id: string): Promise<IFrontendModule> {
        const info = FrontendList.find(item => item.ID === id);
        if(info) {
            return info.LoadModule();
        } else {
            throw new Error(`The frontend could not be found in the list of available frontends!`);
        }
    }

    private async Load(): Promise<void> {
        try {
            const frontendID = this.GetSettingsFrontendID() || FrontendList[0].ID;
            const frontend = await this.GetFrontendModuleByID(frontendID);
            const hook = document.querySelector(frontendSelector) as HTMLElement;
            hook.innerHTML = '';
            await frontend.Render(hook, CreateWindowController());
            this.activeFrontendID = frontendID;
            FrontendController.FrontendLoaded.Dispatch(frontend, this.GetFrontendInfoByID(frontendID));
        } catch(error) {
            console.error(`Failed to load frontend!`, error);
        }
    }

    private Reload(frontendID: string): void {
        if(frontendID !== this.activeFrontendID && confirm(GetLocale().FrontendController_Reload_ConfirmNotice())) {
            window.location.reload();
        }
    }
}