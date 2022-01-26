import { Tags } from './Tags';
import { EventManager } from './EventManager';
import { PluginController } from './PluginController';

export class HakuNeko {

    private readonly _eventManager: EventManager = new EventManager();
    private readonly _pluginController: PluginController = new PluginController();

    public get Tags() {
        return Tags;
    }

    public get EventManager(): EventManager {
        return this._eventManager;
    }

    public get PluginController(): PluginController {
        return this._pluginController;
    }
}