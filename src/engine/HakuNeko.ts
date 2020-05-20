//import { IPlayground, Playground } from './Playground';
import { IPluginController, PluginController } from './PluginController';

export interface IHakuNeko {
    //Playground: IPlayground;
    PluginController: IPluginController;
}

export class HakuNeko implements IHakuNeko {

    //private _playground: IPlayground;
    private readonly _pluginController: IPluginController;

    constructor() {
        //this._playground = new Playground();
        this._pluginController = new PluginController();
    }
    /*
    public get Playground() {
        return this._playground;
    }
    */
    public get PluginController() {
        return this._pluginController;
    }
}