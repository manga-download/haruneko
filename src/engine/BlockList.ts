import { type PlatformInfo, Runtime, DetectPlatform, CreateUnsupportedPlatformError } from './Platform';
import * as BlockListNodeWebkit from './BlockListNodeWebkit';
import * as BlockListBrowser from './BlockListBrowser';

const patterns = [
    '*://*.google.com/*',
];

export function Initialize(info?: PlatformInfo): void {

    info = info ?? DetectPlatform();

    if(info.Runtime === Runtime.NodeWebkit) {
        return BlockListNodeWebkit.Initialize(patterns);
    }

    if([ Runtime.Chrome, Runtime.Gecko, Runtime.WebKit ].includes(info.Runtime)) {
        return BlockListBrowser.Initialize(/*patterns*/);
    }

    throw CreateUnsupportedPlatformError(info);
}