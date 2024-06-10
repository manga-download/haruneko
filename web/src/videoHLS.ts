import Hls from 'hls.js';

export async function PlayHLS(player: HTMLVideoElement, uri: URL) {
    console.log('HLS:', Hls.isSupported());
    const hls = new Hls();
    hls.on(Hls.Events.ERROR, (event, data) => console.warn('HSL:', 'Error occured', event, data.type, data.details));
    hls.on(Hls.Events.MEDIA_ATTACHED, (event, data) => console.log('HLS:', 'Media attached', event, data));
    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => console.log('HLS:', 'Manifest parsed', event, data));
    hls.loadSource(uri.href);
    hls.attachMedia(player);
    console.log('HLS:', hls);
}