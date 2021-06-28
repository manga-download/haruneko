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
    AvailableFrontends: IFrontendInfo[];
    Load(frontendID?: string): Promise<void>;
}

export class FrontendController implements IFrontendController {

    private _mockStorageFrontendID = 'sample-svelte';

    constructor() {
        document.addEventListener('DOMContentLoaded', () => this.Load());
        // TODO: listen to settings controller when the frontend is changed
    }

    public get AvailableFrontends(): IFrontendInfo[] {
        return frontendList;
    }

    private async GetStoredFrontendID(): Promise<string> {
        // TODO: get selected frontend from settings controller or return default
        const defaultFrontendID = this.AvailableFrontends[0].ID;
        return this._mockStorageFrontendID || defaultFrontendID;
    }

    private async SetStoredFrontendID(frontendID: string): Promise<void> {
        // TODO: set selected frontend in settings controller
        this._mockStorageFrontendID = frontendID;
    }

    private async GetFrontendModuleByID(id: string): Promise<IFrontendModule> {
        const info = frontendList.find(item => item.ID === id);
        if(info) {
            const module = await import(info.ModuleFile);
            return module.default as IFrontendModule;
        } else {
            throw new Error('The frontend could not be found in the list of available frontends!');
        }
    }

    public async Load(frontendID?: string): Promise<void> {
        try {
            const storedFrontendID = await this.GetStoredFrontendID();
            if(frontendID === storedFrontendID) {
                return;
            }
            frontendID = frontendID || storedFrontendID;
            const frontend = await this.GetFrontendModuleByID(frontendID);
            const hook = document.querySelector(frontendSelector) as HTMLElement;
            hook.innerHTML = '';
            frontend.Render(hook);
            frontend.SetWindowMenu();
            this.SetStoredFrontendID(frontendID);
        } catch(error) {
            console.error(`Failed to load frontend with id '${frontendID}'!`, error);
        }
    }
}