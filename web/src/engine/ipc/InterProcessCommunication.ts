import type { JSONElement } from 'websocket-rpc/dist/types';
import type { SettingsManager } from '../SettingsManager';
import { NodeWebkitIPC } from './NodeWebkit';

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
 * Interface declaring methods that must be implemented in app context (background script).
 */
export abstract class AppIPC implements Contract<AppIPC> {
    abstract StopRPC(): Promise<void>;
    abstract RestartRPC(port: number, secret: string): Promise<void>;
    abstract SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void>;
}

/**
 * Interface declaring methods that must be implemented in web context (content script).
 */
export abstract class WebIPC implements Contract<WebIPC> {
    abstract LoadMediaContainerFromURL(url: string): Promise<void>;
}

export interface PlatformIPC extends AppIPC, WebIPC {}

export function CreatePlatformIPC(settingsManager: SettingsManager): PlatformIPC {
    if(window.nw) {
        return new NodeWebkitIPC(settingsManager);
    }
    /*
    if('electron' in window) {
        return new ElectronIPC();
    }
    if(window.nw) {
        return new BrowserIPC();
    }
    */
    // TODO: Localization ...
    throw new Error('Platform not supported!');
}