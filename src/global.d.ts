import { IHakuNeko } from './engine/HakuNeko';
import { IFrontendController } from './frontend/FrontendController';

/*
declare namespace NodeJS {
    interface Process {
        browser: boolean;
    }
}
*/

declare global {
    const HakuNeko: IHakuNeko;
    const Frontend: IFrontendController;
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
    const nw: any;
}