
import GetIPC from './engine/platform/InterProcessCommunication';
import { CreateAppWindow } from './engine/platform/AppWindow';
import { PlayVideoJS } from './videoJS';
import { PlayHLS } from './videoHLS';
import { PlayMSE } from './videoMSE';

// 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
// https://mdn.github.io/dom-examples/sourcebuffer/frag_bunny.mp4

// https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#enable-proprietary-codecs
// https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases

// http://docs.evostream.com/sample_content/assets/sintel1m720p.mp4
// http://docs.evostream.com/sample_content/assets/hls-sintel-abr3/playlist.m3u8
// http://docs.evostream.com/sample_content/assets/hls-sintel-abr3/sintel480p/playlist.m3u8

// https://stream.nuevodevel.com/video/big_buck_720.mp4
// https://stream.nuevodevel.com/video/animals_720.mp4

// #EXT-X-STREAM-INF:BANDWIDTH=4928000,CODECS="avc1.42c00d,mp4a.40.2",RESOLUTION=1280x720
// https://stream.nuevodevel.com/hls/blender/blender_720.m3u8

// HLS:  https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8
// DASH: https://d2zihajmogu5jn.cloudfront.net/sintel_dash/sintel_vod.mpd

function createPlayer() {
    const player = document.createElement('video');
    //player.id = 'video';
    player.crossOrigin = 'anonymous';
    player.controls = true;
    player.style.width = '100%';
    player.style.height = '100%';
    player.style.background = '#404080';
    document.body.appendChild(player);
    return player;
}

(async function() {
    GetIPC().Send('FetchProvider::Initialize', 'X-FetchAPI-');
    CreateAppWindow('').HideSplash();
    document.body.innerHTML = null;    
    try {
        const player = createPlayer();
        //return PlayVideoJS(player, new URL('https://mdn.github.io/dom-examples/sourcebuffer/frag_bunny.mp4'));
        //return PlayVideoJS(player, new URL('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'));
        //return PlayHLS(player, new URL('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'));
        return PlayMSE(player, new URL('https://mdn.github.io/dom-examples/sourcebuffer/frag_bunny.mp4'));
    } catch(error) {
        console.warn(error);
    }
})();