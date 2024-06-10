import videojs from 'video.js';

export async function PlayVideoJS(player: HTMLVideoElement, uri: URL) {
    const source = document.createElement('source');
    //source.type = 'video/mp4';
    //source.type = 'application/x-mpegURL';
    //source.type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    source.src = uri.href;
    player.appendChild(source);
    const vjs = videojs(player);
    vjs.controls(true);
    console.log('VideoJS:', vjs);
}