import { IFrontendInfo, IFrontendModule } from './IFrontend';
import { Info as InfoClassic } from './classic/Frontend.Info';
import { Info as InfoPlayground } from './playground/Frontend.Info';

const frontendSelector: string = '#hakuneko';
const frontendList: IFrontendInfo[] = [
    InfoClassic,
    InfoPlayground
];

export interface IFrontendController {
    AvailableFrontends: IFrontendInfo[];
    Initialize: () => Promise<void>;
}

export class FrontendController implements IFrontendController {
    
    constructor() {
        document.addEventListener('DOMContentLoaded', this.Initialize.bind(this));
        // TODO: listen to settings controller when the frontend is changed
    }

    public get AvailableFrontends(): IFrontendInfo[] {
        return frontendList;
    }

    private async GetFrontendModuleByID(id: string): Promise<IFrontendModule> {
        let file = frontendList.find(item => item.ID === id).ModuleFile;
        return ((await import(file)) as IFrontendModule);
    }

    public async Initialize(): Promise<void> {
        try {
            // TODO: get selected frontend from settings controller
            let selectedFrontendID = 'classic'; // 'playground'
            let frontend = await this.GetFrontendModuleByID(selectedFrontendID);
            let hook = document.querySelector(frontendSelector);
            hook.innerHTML = '';
            frontend.Render(hook);
        } catch(error) {
            console.error('Failed to load frontend!', error);
        }
    }
}