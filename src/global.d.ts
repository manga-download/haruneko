import { IHakuNeko } from './engine/HakuNeko';
import { IExploitedRequest } from './engine/RequestProvider';
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
    var ExploitedRequest: IExploitedRequest;
    interface Window {
        HakuNeko: IHakuNeko;
        Frontend: IFrontendController;
        ExploitedRequest: IExploitedRequest;
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