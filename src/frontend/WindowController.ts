import { type PlatformInfo, Runtime, CreateUnsupportedPlatformError, DetectPlatform } from '../engine/Platform';
import { WindowControllerNodeWebkit } from './WindowControllerNodeWebkit';

export interface IWindowController {
    readonly HasControls: boolean;
    Minimize(): void;
    Maximize(): void;
    Restore(): void;
    Close(): void;
}

export function CreateWindowController(info?: PlatformInfo): IWindowController {

    info = info ?? DetectPlatform();

    if(info.Runtime === Runtime.NodeWebkit) {
        return new WindowControllerNodeWebkit(nw.Window.get());
    }

    if([ Runtime.Chrome, Runtime.Gecko, Runtime.WebKit ].includes(info.Runtime)) {
        return null;
    }

    throw CreateUnsupportedPlatformError(info);
}