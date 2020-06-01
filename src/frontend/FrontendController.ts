import { IFrontendInfo, IFrontendModule } from './IFrontend'
import { Info as InfoClassic } from './classic/FrontendInfo'
import { Info as InfoJS } from './sample-js/FrontendInfo'
import { Info as InfoReact } from './sample-react/FrontendInfo'
import { Info as InfoSvelte } from './sample-svelte/FrontendInfo'
import { Info as InfoVue } from './sample-vue/FrontendInfo'

const frontendSelector: string = '#hakuneko';
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

    private _mockStorageFrontendID = 'classic';

    constructor() {
        document.addEventListener('DOMContentLoaded', event => this.Load());
        // TODO: listen to settings controller when the frontend is changed
    }

    public get AvailableFrontends(): IFrontendInfo[] {
        return frontendList;
    }

    private async GetStoredFrontendID(): Promise<string> {
        // TODO: get selected frontend from settings controller or return default
        let defaultFrontendID = this.AvailableFrontends[0].ID;
        return this._mockStorageFrontendID || defaultFrontendID;
    }

    private async SetStoredFrontendID(frontendID: string): Promise<void> {
        // TODO: set selected frontend in settings controller
        this._mockStorageFrontendID = frontendID;
    }

    private async GetFrontendModuleByID(id: string): Promise<IFrontendModule> {
        let file = frontendList.find(item => item.ID === id).ModuleFile;
        let module = await import(file);
        return module.default as IFrontendModule;
    }

    public async Load(frontendID?: string): Promise<void> {
        try {
            let storedFrontendID = await this.GetStoredFrontendID()
            if(frontendID === storedFrontendID) {
                return;
            }
            frontendID = frontendID || storedFrontendID;
            let frontend = await this.GetFrontendModuleByID(frontendID);
            let hook = document.querySelector(frontendSelector) as HTMLElement;
            hook.innerHTML = '';
            frontend.Render(hook);
            this.SetStoredFrontendID(frontendID);
        } catch(error) {
            console.error('Failed to load frontend!', error);
        }
    }
}