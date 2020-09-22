import { IEventEmitter, EventEmitter } from './EventEmitter';
import { IPluginController, PluginController } from './PluginController';
import { IRequestProvider, RequestProvider } from './RequestProvider';

export interface IHakuNeko {
    EventEmitter: IEventEmitter;
    PluginController: IPluginController;
    RequestProvider: IRequestProvider;
}

export class HakuNeko implements IHakuNeko {

    private readonly _eventEmitter: IEventEmitter = new EventEmitter();
    private readonly _pluginController: IPluginController = new PluginController();
    private readonly _requestProvider: IRequestProvider = new RequestProvider();

    public get EventEmitter(): IEventEmitter {
        return this._eventEmitter;
    }

    public get PluginController(): IPluginController {
        return this._pluginController;
    }

    public get RequestProvider(): IRequestProvider {
        return this._requestProvider;
    }
}