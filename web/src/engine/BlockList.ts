import { type PlatformInfo, Runtime, DetectPlatform, CreateUnsupportedPlatformError } from './Platform';
import * as BlockListNodeWebkit from './BlockListNodeWebkit';
import * as BlockListBrowser from './BlockListBrowser';

// Sort: https://www.online-utility.org/text/sort.jsp
const patterns = [
    '*://*.adskeeper.co.uk/*',
    '*://*.arc.io/*',
    '*://*.bidgear.com/*',
    '*://*.chatango.com/*',
    '*://*.clokemidriff.com/*',
    '*://*.doubleclick.net/*',
    '*://*.google-analytics.com/*',
    '*://*.googlesyndication.com/*',
    '*://*.magsrv.com/*',
    '*://*.onesignal.com/*',
    '*://*.ospicalad.buzz/*',
    '*://*.outbrain.com/*',
    '*://*.outbrainimg.com/*',
    '*://*.papayads.net/*',
    '*://*.prplads.com/*',
    '*://*.purpleads.io/*',
    '*://*.sentry.io/*',
    '*://*.sharethis.com/*',
    '*://*.twitch.tv/*', // prevent test timeout on seinagi & pzykosis666hfansub
    '*://*.yandex.ru/*.js',
    '*://*/**/devtools-detect*',
    '*://*/**/devtools-detector*',
    '*://*/**/disable-devtool*',
    '*://*/Ads/*',
    '*://*/js/ads*',
    '*://captivatepestilentstormy.com/*',
    '*://creepingbrings.com/*',
    '*://crunchyscan.fr/arc-sw?*',
    '*://crunchyscan.fr/arc-widget',
    '*://crunchyscan.fr/blockexx.js',
    '*://fireworksane.com/*',
    '*://goomaphy.com/*',
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