import { type IEventManager, EventManager } from './EventManager';
import { type IPluginController, PluginController } from './PluginController';

export interface IHakuNeko {
    readonly EventManager: IEventManager;
    readonly PluginController: IPluginController;
}

export class HakuNeko implements IHakuNeko {

    private readonly _eventManager: IEventManager = new EventManager();
    private readonly _pluginController: IPluginController = new PluginController();

    public get EventManager(): IEventManager {
        return this._eventManager;
    }

    public get PluginController(): IPluginController {
        return this._pluginController;
    }
}