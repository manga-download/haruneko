import type { JSONElement } from 'websocket-rpc/dist/types';
import { NodeWebkitIPC } from './NodeWebkit';

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
    abstract RestartRPC(): Promise<void>;
    abstract Foo(id: number): Promise<{ id: number, value: string }>;
}

/**
 * Interface declaring methods that must be implemented in web context (content script).
 */
export abstract class WebIPC implements Contract<WebIPC> {
    abstract Bar(id: number): Promise<{ id: number, value: string }>;
}

export interface PlatformIPC extends AppIPC, WebIPC {}

export function CreatePlatformIPC(): PlatformIPC {
    if(window.nw) {
        return new NodeWebkitIPC();
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