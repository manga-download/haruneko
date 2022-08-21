import { GetLocale } from '../i18n/Localization';
import { Event } from '../engine/Event';
import type { IFrontendInfo, IFrontendModule } from './IFrontend';
import { Info as InfoClassic } from './classic/FrontendInfo';
import { Info as InfoFluentCore } from './fluent-core/FrontendInfo';
import { CreateWindowController } from './WindowController';

const frontendSelector = '#app';
const frontendList: IFrontendInfo[] = [
    InfoClassic,
    InfoFluentCore
];

export interface IFrontendController {
    readonly ActiveFrontendID: string;
    AvailableFrontends: IFrontendInfo[];
}

export class FrontendController implements IFrontendController {

    private activeFrontendID = '';
    public static readonly FrontendLoaded = new Event<IFrontendModule, IFrontendInfo>();

    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.Load);
        } else {
            this.Load();
        }
        // TODO: listen to settings controller when the frontend is changed => Reload(...)
    }

    public get ActiveFrontendID(): string {
        return this.activeFrontendID;
    }

    public get AvailableFrontends(): IFrontendInfo[] {
        return frontendList;
    }

    private async GetStoredFrontendID(): Promise<string | null> {
        // TODO: get selected frontend through settings engine
        const frontendID = window.localStorage.getItem('hakuneko.frontend');
        return frontendList.some(frontend => frontend.ID === frontendID) ? frontendID : null;
    }

    private async SetStoredFrontendID(frontendID: string | null): Promise<void> {
        if(frontendID && frontendList.some(frontend => frontend.ID === frontendID)) {
            // TODO: set selected frontend through settings engine
            window.localStorage.setItem('hakuneko.frontend', frontendID);
        }
    }

    private GetFrontendInfoByID(id: string): IFrontendInfo {
        const info = frontendList.find(item => item.ID === id);
        if(info) {
            return info;
        } else {
            throw new Error(`The frontend information could not be found in the list of available frontends!`);
        }
    }

    private async GetFrontendModuleByID(id: string): Promise<IFrontendModule> {
        const info = frontendList.find(item => item.ID === id);
        if(info) {
            return info.LoadModule();
        } else {
            throw new Error(`The frontend could not be found in the list of available frontends!`);
        }
    }

    private async Load(): Promise<void> {
        try {
            const frontendID = await this.GetStoredFrontendID() || this.AvailableFrontends[0].ID;
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

    // Apply new frontend assigned by settings and ask to reload application ...
    public async Reload(frontendID: string): Promise<void> {
        await this.SetStoredFrontendID(frontendID);
        if(frontendID !== this.ActiveFrontendID && confirm(GetLocale().FrontendController_Reload_ConfirmNotice())) {
            window.location.reload();
        }
    }
}