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

/*
class MediaStreamHLS implements MediaStream {

    constructor(private readonly playlistURL: string) {}

    public async GetSource(): Promise<string> {
        const source = document.createElement('source');
        source.type = 'application/x-mpegURL';
        source.src = '';
        return '';
    }
}
*/

class Range {
    constructor(
        public readonly Start: number,
        public readonly End: number,
    ) {}
}

class Chunk {
    constructor(
        public readonly Size: number,
        public readonly Bytes: Range,
        public readonly Time: Range,
    ) {}
}

class EpisodeInfo {
    constructor(
        public readonly Size: number,
        public readonly Codec: string,
        public readonly Duration: number,
        public readonly Chunks: Chunk[],
    ) {}
}

class Episode {

    public readonly info: Promise<EpisodeInfo>;

    constructor(private readonly stream: URL) {
        this.info = this.Load();
    }

    private async Load(): Promise<EpisodeInfo> {
        const head = await fetch(this.stream, { method: 'HEAD' });
        const size = parseInt(head.headers.get('content-length'));
        console.log('Length:', '=>', size);
        console.log('Range:', '=>', head.headers.get('accept-ranges'));
        console.log('Mime:', '=>', head.headers.get('content-type'));
        return new EpisodeInfo(size, await this.DetectMimeCodec(), 60, [
            new Chunk(size, new Range(      0, 1048576 - 1), new Range(0, 60)),
            new Chunk(size, new Range(1048576, 2097152 - 1), new Range(0, 60)),
            new Chunk(size, new Range(2097152, 3145728 - 1), new Range(0, 60)),
            new Chunk(size, new Range(3145728, 4194304 - 1), new Range(0, 60)),
            new Chunk(size, new Range(4194304, 5242880 - 1), new Range(0, 60)),
            new Chunk(size, new Range(5242880, 5524488 - 1), new Range(0, 60)),
        ]);
    }

    private async DetectMimeCodec(): Promise<string> {
        // 'video/webm; codecs="vorbis,vp8"'
        return 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    }

    public async GetInfo(): Promise<EpisodeInfo> {
        return this.info;
    }

    public async GetChunk(index: number): Promise<ArrayBuffer> {
        const info = await this.info;
        const start = index * 1048576;
        const end = Math.min(start + 1048576 - 1, info.Size - 1);
        const response = await fetch(this.stream, { headers: { 'Range': `bytes=${start}-${end}/${info.Size}` } });
        return await response.arrayBuffer();
    }
}

interface MediaStream {
    //GetSource(): Promise<HTMLSourceElement>;
    Load(episode: Episode): Promise<void>;
    Play(offset: number): Promise<void>;
}

class MediaStreamMP4 implements MediaStream {

    private readonly mediaSource: MediaSource;
    private readonly ready: Promise<Event>;
    private episode: Episode;

    constructor(private readonly player: HTMLVideoElement) {
        this.mediaSource = new MediaSource();
        this.ready = new Promise(resolve => {
            //this.mediaSource.onsourceopen = resolve;
            this.mediaSource.onsourceopen = event => {
                console.log('mediaSource.onsourceopen', '=>', event);
                resolve(event);
            };
        });
        this.mediaSource.onsourceended = event => console.log('mediaSource.onsourceended', '=>', event);
        this.mediaSource.onsourceclose = event => console.log('mediaSource.onsourceclose', '=>', event);
        this.player.src = URL.createObjectURL(this.mediaSource);
    }

    public async Load(episode: Episode): Promise<void> {
        this.episode = episode;
        const info = await episode.GetInfo();
        if(MediaSource.isTypeSupported(info.Codec)) {
            console.log('Supported Mime Type:', info.Codec);
            //console.log('TODO: Release current object URL', '=>', this.player.src);
            //URL.revokeObjectURL(this.player.src);
            //this.player.src = URL.createObjectURL(this.mediaSource);
        } else {
            console.warn('Unsupported Mime Type:', info.Codec);
        }
    }

    public async Play(offset: number = 0): Promise<void> {

        await this.ready;
        const info = await this.episode.GetInfo();
        console.log('Info', '=>', info);

        //mediaSource.setLiveSeekableRange(0, 10);
        //this.mediaSource.removeSourceBuffer(this.mediaSource.sourceBuffers[0]);
        const sourceBuffer = this.mediaSource.addSourceBuffer(info.Codec);
        sourceBuffer.onupdate = event => console.log('sourceBuffer.onupdate', '=>', event);
        sourceBuffer.onupdatestart = event => console.log('sourceBuffer.onupdatestart', '=>', event);
        sourceBuffer.onupdateend = event => console.log('sourceBuffer.onupdateend', '=>', event);

        for(let index = 0; index < info.Chunks.length; index++) {
            await new Promise(resolve => setTimeout(resolve, 2500));
            const data = await this.episode.GetChunk(index);
            console.log('Bytes:', data.byteLength);
            sourceBuffer.appendBuffer(data);
        }

        /*
        sourceBuffer.addEventListener('updateend', () => {
            mediaSource.endOfStream();
            //video.play();
        });
        */


        //console.log('TODO: Release current object URL', '=>', this.player.src);
        //this.player.src = URL.createObjectURL(this.mediaSource);

    }
}

// https://nwjs.readthedocs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#enable-proprietary-codecs
// https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases

(async function() {
    CreateAppWindow('').HideSplash();
    document.body.innerHTML = null;    
    try {
        const player = createPlayer();
        const streamer = new MediaStreamMP4(player);
        const episode = new Episode(new URL('https://mdn.github.io/dom-examples/sourcebuffer/frag_bunny.mp4'));
        await streamer.Load(episode);
        //await streamer.Load('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4');
        await streamer.Play(0);
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