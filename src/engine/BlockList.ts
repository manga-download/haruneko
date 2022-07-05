import { type PlatformInfo, Runtime, DetectPlatform, CreateUnsupportedPlatformError } from './Platform';
import * as BlockListNodeWebkit from './BlockListNodeWebkit';
import * as BlockListBrowser from './BlockListBrowser';

const patterns = [
    '*://*/js/ads*',
    '*://owewary.com/*',
    '*://pickupfaxmultitude.com/*',
    '*://captivatepestilentstormy.com/*',
    '*://creepingbrings.com/*',
    '*://crunchyscan.fr/arc-sw?*',
    '*://crunchyscan.fr/arc-widget',
    '*://crunchyscan.fr/blockexx.js',
    '*://crunchyscan.fr/node_modules/devtools-detect/*',
    '*://tumultmarten.com/*',
    '*://*.chatango.com/*',
    '*://*.arc.io/*',
    '*://*.doubleclick.net/*',
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