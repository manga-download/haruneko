import { i18n } from '../engine/i18n/Localization';
import { IFrontendInfo, IFrontendModule } from './IFrontend';
import { Info as InfoClassic } from './classic/FrontendInfo';
import { Info as InfoJS } from './sample-js/FrontendInfo';
import { Info as InfoReact } from './sample-react/FrontendInfo';
import { Info as InfoSvelte } from './sample-svelte/FrontendInfo';
import { Info as InfoVue } from './sample-vue/FrontendInfo';

const frontendSelector = '#app';
const frontendList: IFrontendInfo[] = [
    InfoClassic,
    InfoJS,
    InfoReact,
    InfoSvelte,
    InfoVue
];

export interface IFrontendController {
    readonly ActiveFrontendID: string;
    AvailableFrontends: IFrontendInfo[];
}

export class FrontendController implements IFrontendController {

    private activeFrontendID = '';

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

    private async GetFrontendModuleByID(id: string): Promise<IFrontendModule> {
        const info = frontendList.find(item => item.ID === id);
        if(info) {
            const module = await import(info.ModuleFile);
            return module.default as IFrontendModule;
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
            frontend.Render(hook);
            frontend.SetWindowMenu();
            this.activeFrontendID = frontendID;
        } catch(error) {
            console.error(`Failed to load frontend!`, error);
        }
    }

    // Apply new frontend assigned by settings and ask to reload application ...
    public async Reload(frontendID: string): Promise<void> {
        await this.SetStoredFrontendID(frontendID);
        if(frontendID !== this.ActiveFrontendID && confirm(i18n('FrontendController.Reload.ConfirmNotice'))) {
            window.location.reload();
        }
    }
}