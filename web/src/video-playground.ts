//import Hls from 'hls.js';
//import videojs from 'video.js';
import { CreateAppWindow } from './engine/platform/AppWindow';

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

/*
async function playRAW() {
    const player = createPlayer();
    player.src = 'https://mdn.github.io/dom-examples/sourcebuffer/frag_bunny.mp4';
}
*/

/*
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
*/

/*
async function playVideoJS() {
    try {
        const player = createPlayer();
        const source = document.createElement('source');
        //source.type = 'application/x-mpegURL';
        //source.src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
        //source.type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        source.type = 'video/mp4';
        source.src = 'https://mdn.github.io/dom-examples/sourcebuffer/frag_bunny.mp4';
        player.appendChild(source);
        const vjs = videojs(player);
        console.log(vjs);
    } catch(error) {
        console.warn(error);
    }
}
*/

interface MediaStream {
    //GetSource(): Promise<HTMLSourceElement>;
    Play(): Promise<void>;
}

class MediaStreamHLS implements MediaStream {

    constructor(private readonly playlistURL: string) {}

    public async GetSource(): Promise<string> {
        const source = document.createElement('source');
        source.type = 'application/x-mpegURL';
        source.src = '';
        return '';
    }
}

class MediaStreamMP4 implements MediaStream {

    constructor(private readonly player: HTMLVideoElement, private readonly streamURL: string) {
        //this.GetSource();
    }

    private async DetectMimeCodec(): Promise<string> {
        return 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'; // 'video/webm; codecs="vorbis,vp8"'
    }

    public async Play(offset: number = 0): Promise<void> {

        const mediaSource = new MediaSource();

        mediaSource.addEventListener('sourceclose', (event) => {
            console.log('sourceclose', event);
            //URL.revokeObjectURL(uri);
        });

        mediaSource.addEventListener('sourceopen', async (event) => {
            console.log('sourceopen', event);
            const head = await fetch(this.streamURL, { method: 'HEAD' });
            const size = parseInt(head.headers.get('content-length'));
            console.log('Length:', '=>', size);
            console.log('Range:', '=>', head.headers.get('accept-ranges'));
            console.log('Mime:', '=>', head.headers.get('content-type'));
            const mimeCodec = await this.DetectMimeCodec();
            console.log(mimeCodec, '=>', MediaSource.isTypeSupported(mimeCodec));
            //mediaSource.setLiveSeekableRange(0, 10);
            const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
            /*
            sourceBuffer.addEventListener('updateend', () => {
                mediaSource.endOfStream();
                //video.play();
                console.log(mediaSource.readyState); // ended
            });
            */
            for(let offset = 0; offset < size; offset += 1048576) {
                const response = await fetch(this.streamURL, { headers: { 'Range': `bytes=${offset}-${offset + 1048576}` } });
                const data = await response.arrayBuffer();
                console.log('Data:', data.byteLength);
                sourceBuffer.appendBuffer(data);
                await new Promise(resolve => setTimeout(resolve, 2500));
            }
        });

        console.log('TODO: Release current object URL', '=>', this.player.src);
        this.player.src = URL.createObjectURL(mediaSource);

    }
}

// https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#enable-proprietary-codecs
// https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases

(async function() {
    CreateAppWindow('').HideSplash();
    document.body.innerHTML = null;    
    try {
        const player = createPlayer();
        await new MediaStreamMP4(player, 'https://mdn.github.io/dom-examples/sourcebuffer/frag_bunny.mp4').Play();
        //await new MediaStreamMP4(player, 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4').GetSource();
    } catch(error) {
        console.warn(error);
    }
})();

// http://docs.evostream.com/sample_content/assets/sintel1m720p.mp4
// https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov
// https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_stereo.ogg
// .mkv
// .webm
// http://docs.evostream.com/sample_content/assets/hls-sintel-abr3/playlist.m3u8
// http://docs.evostream.com/sample_content/assets/hls-sintel-abr3/sintel480p/playlist.m3u8