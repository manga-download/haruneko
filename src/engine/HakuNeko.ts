import { IEventEmitter, EventEmitter } from './EventEmitter';
import { IPluginController, PluginController } from './PluginController';

export interface IHakuNeko {
    EventEmitter: IEventEmitter;
    PluginController: IPluginController;
}

export class HakuNeko implements IHakuNeko {

    private readonly _eventEmitter: IEventEmitter = new EventEmitter();
    private readonly _pluginController: IPluginController = new PluginController();

    public get EventEmitter(): IEventEmitter {
        return this._eventEmitter;
    }

    public get PluginController(): IPluginController {
        return this._pluginController;
    }
}