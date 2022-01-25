import { Tags } from './Tags';
import { type IEventManager, EventManager } from './EventManager';
import { type IPluginController, PluginController } from './PluginController';

export class HakuNeko {

    private readonly _eventManager: IEventManager = new EventManager();
    private readonly _pluginController: IPluginController = new PluginController();

    public get Tags() {
        return Tags;
    }

    public get EventManager(): IEventManager {
        return this._eventManager;
    }

    public get PluginController(): IPluginController {
        return this._pluginController;
    }
}