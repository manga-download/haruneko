import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitBloatGuard from './nw/BloatGuard';
import ElectronBloatGuard from './electron/BloatGuard';

// Sort: https://www.online-utility.org/text/sort.jsp
const patterns = [
    '*://*.adskeeper.co.uk/*',
    '*://*.adskeeper.com/*',
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
    '*://*.topcreativeformat.com/*',
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
    '*://t7cp4fldl.com/*',
    '*://tumultmarten.com/*',
];

export interface IBloatGuard {
    Initialize(): void;
}

export function CreateBloatGuard(): IBloatGuard {
    return new PlatformInstanceActivator<IBloatGuard>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitBloatGuard(patterns))
        .Configure(Runtime.Electron, () => new ElectronBloatGuard(patterns))
        .Create();
}