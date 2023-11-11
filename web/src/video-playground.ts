import Hls from 'hls.js';
import videojs from 'video.js';
//import * as xxx from '../../node_modules/@videojs/http-streaming';

export async function Stream(): Promise<void> {
    return playHLS();
    //return playVideo();
}

function createPlayer() {
    const player = document.createElement('video');
    player.crossOrigin = 'anonymous';
    player.controls = true;
    player.style.width = '100%';
    player.style.height = '100%';
    player.style.background = '#404080';
    document.body.innerHTML = null;
    document.body.appendChild(player);
    return player;
}

async function playHLS() {
    try {
        const player = createPlayer();
        console.log('HLS:', Hls.isSupported());
        const hls = new Hls();
        hls.on(Hls.Events.ERROR, (event, data) => console.warn('HSL:', 'Error occured', event, data.type, data.details));
        hls.on(Hls.Events.MEDIA_ATTACHED, (event, data) => console.log('HLS:', 'Media attached', event, data));
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => console.log('HLS:', 'Manifest parsed', event, data));
        hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
        hls.attachMedia(player);
        console.log(hls);
    } catch(error) {
        console.warn(error);
    }
}

async function playVideo() {
    try {
        const player = createPlayer();
        const source = document.createElement('source');
        source.type = 'application/x-mpegURL';
        source.src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
        player.appendChild(source);
        const vjs = videojs(player);
        console.log(vjs);
    } catch(error) {
        console.warn(error);
    }
}