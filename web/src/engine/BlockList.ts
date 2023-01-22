import { type PlatformInfo, Runtime, DetectPlatform, CreateUnsupportedPlatformError } from './Platform';
import * as BlockListNodeWebkit from './BlockListNodeWebkit';
import * as BlockListBrowser from './BlockListBrowser';

// Sort: https://www.online-utility.org/text/sort.jsp
const patterns = [
    '*://*.arc.io/*',
    '*://*.chatango.com/*',
    '*://*.doubleclick.net/*',
    '*://*.onesignal.com/*',
    '*://*.ospicalad.buzz/*',
    '*://*.sentry.io/*',
    '*://*.yandex.ru/*.js',
    '*://*/js/ads*',
    '*://captivatepestilentstormy.com/*',
    '*://creepingbrings.com/*',
    '*://crunchyscan.fr/arc-sw?*',
    '*://crunchyscan.fr/arc-widget',
    '*://crunchyscan.fr/blockexx.js',
    '*://crunchyscan.fr/node_modules/devtools-detect/*',
    '*://owewary.com/*',
    '*://pickupfaxmultitude.com/*',
    '*://tumultmarten.com/*',
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