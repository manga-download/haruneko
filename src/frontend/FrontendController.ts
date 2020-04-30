const frontend = {
    selector: '#hakuneko',
    path: './{id}/Initialize.js'
};

export interface IFrontend {
    id: string;
    label: string;
    description: string;
}

export interface IFrontendController {
    AvailableFrontends: IFrontend[];
    Initialize: () => Promise<void>;
}

export class FrontendController implements IFrontendController {
    
    constructor() {
        document.addEventListener('DOMContentLoaded', this.Initialize);
    }

    public get AvailableFrontends() {
        return [];
    }

    public async Initialize() {
        try {
            let hook = document.querySelector(frontend.selector);
            hook.innerHTML = '';
            // TODO: dynamically load and initialize the frontend (from settings)
            let file = frontend.path.replace('{id}', 'classic'); // 'playground'
            (await import(file)).default(hook);
        } catch(error) {
            console.error('Failed to load frontend!', error);
        }
    }
}