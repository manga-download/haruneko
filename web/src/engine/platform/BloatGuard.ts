import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitBloatGuard from './nw/BloatGuard';
import ElectronBloatGuard from './electron/BloatGuard';
import GetIPC from './InterProcessCommunication';

export interface IBloatGuard {
    Initialize(): Promise<void>;
}

export function CreateBloatGuard(): IBloatGuard {
    return new PlatformInstanceActivator<IBloatGuard>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitBloatGuard(patterns))
        .Configure(Runtime.Electron, () => new ElectronBloatGuard(GetIPC(), patterns))
        .Create();
}

// Sort: https://www.online-utility.org/text/sort.jsp
const patterns = [
    '*://*.21wiz.com/*',
    '*://*.4dex.io/*',
    '*://*.a-ads.com/*',
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
    '*://*.mgid.com/*',
    '*://*.onesignal.com/*',
    '*://*.ospicalad.buzz/*',
    '*://*.outbrain.com/*',
    '*://*.outbrainimg.com/*',
    '*://*.papayads.net/*',
    '*://*.profitableratecpm.com/',
    '*://*.prplads.com/*',
    '*://*.pubadx.one/*',
    '*://*.pubfuture-ad.com/*',
    '*://*.purpleads.io/*',
    '*://*.sentry.io/*',
    '*://*.sharethis.com/*',
    '*://*.topcreativeformat.com/*',
    '*://*.twitch.tv/*',
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
    '*://fleraprt.com/*',
    '*://goomaphy.com/*',
    '*://obqj2.com/',
    '*://owewary.com/*',
    '*://pickupfaxmultitude.com/*',
    '*://stoampaliy.net/*',
    '*://t7cp4fldl.com/*',
    '*://tqqbhtnshynrypl.xyz/*',
    '*://tumultmarten.com/*',
    '*://voltoishime.top/*',
    '*://www.facebook.com/*/plugins/comments.php*',
    '*://www.facebook.net/*/plugins/comments.php*'
];