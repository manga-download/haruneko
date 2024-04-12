import type { JSONElement } from '../../../../node_modules/websocket-rpc/dist/types';
import type { SettingsManager } from '../SettingsManager';
import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitInterProcessCommunication from './nw/InterProcessCommunication';
import ElectronInterProcessCommunication from './electron/InterProcessCommunication';

// See => chrome.cookies.Cookie
export type TypeFromInterface<T> = {
    [key in keyof T]: T[key];
};

export type IPCParameters = JSONElement[];

export type IPCPayload<T> = {
    method: keyof T,
    parameters: IPCParameters,
}

export type IPCResponse = JSONElement | void;

type Contract<T> = {
    [K in keyof T]: (...params: IPCParameters) => Promise<IPCResponse>;
}

/**
 * An interface that declares methods that must be implemented within the app context (background script / main process).
 */
export abstract class AppIPC implements Contract<AppIPC> {
    abstract StopRPC(): Promise<void>;
    abstract RestartRPC(port: number, secret: string): Promise<void>;
    abstract SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void>;
}

/**
 * An interface that declares methods that must be implemented within the web context (content script / render process).
 */
export abstract class WebIPC implements Contract<WebIPC> {
    abstract LoadMediaContainerFromURL(url: string): Promise<void>;
}

export interface PlatformIPC extends AppIPC, WebIPC {}

export function CreatePlatformIPC(settingsManager: SettingsManager): PlatformIPC {
    return new PlatformInstanceActivator<PlatformIPC>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitInterProcessCommunication(settingsManager))
        .Configure(Runtime.Electron, () => new ElectronInterProcessCommunication(settingsManager))
        .Create();
}