import { IHakuNeko } from './engine/HakuNeko';
import { IFetchRequest } from './engine/RequestProvider';
import { IFrontendController } from './frontend/FrontendController';

/*
declare namespace NodeJS {
    interface Process {
        browser: boolean;
    }
}
*/

declare global {
    var HakuNeko: IHakuNeko;
    var Frontend: IFrontendController;
    var FetchRequest: IFetchRequest;
    interface Window {
        HakuNeko: IHakuNeko;
        Frontend: IFrontendController;
        FetchRequest: IFetchRequest;
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