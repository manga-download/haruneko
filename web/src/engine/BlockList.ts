import { type PlatformInfo, Runtime, DetectPlatform, CreateUnsupportedPlatformError } from './Platform';
import * as BlockListNodeWebkit from './BlockListNodeWebkit';
import * as BlockListBrowser from './BlockListBrowser';

// Sort: https://www.online-utility.org/text/sort.jsp
const patterns = [
    '*://*/**/devtools-detector*',
    '*://*/**/devtools-detect*',
    '*://*/**/disable-devtool*',
    '*://*/js/ads*',
    '*://*.adskeeper.co.uk/*',
    '*://*.arc.io/*',
    '*://*.chatango.com/*',
    '*://*.doubleclick.net/*',
    '*://*.google-analytics.com/*',
    '*://*.googlesyndication.com/*',
    '*://*.magsrv.com/*',
    '*://*.onesignal.com/*',
    '*://*.ospicalad.buzz/*',
    '*://*.papayads.net/*',
    '*://*.sentry.io/*',
    '*://*.twitch.tv/*', // prevent test timeout on seinagi & pzykosis666hfansub
    '*://*.yandex.ru/*.js',
    '*://captivatepestilentstormy.com/*',
    '*://creepingbrings.com/*',
    '*://crunchyscan.fr/arc-sw?*',
    '*://crunchyscan.fr/arc-widget',
    '*://crunchyscan.fr/blockexx.js',
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