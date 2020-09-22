import { IHakuNeko } from './engine/HakuNeko';
import { IFrontendController } from './frontend/FrontendController';

declare namespace NodeJS {
    interface Process {
        browser: boolean;
    }
}

declare global {
    interface Window {
        HakuNeko: IHakuNeko;
        Frontend: IFrontendController;
    }
    /*
    interface NodeJS {
        Process: {
            'node-webkit': string;
        }
    }
    */
    const nw: any
}