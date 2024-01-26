function createPlayer() {
    const player = document.createElement('video');
    player.id = 'video';
    player.crossOrigin = 'anonymous';
    player.controls = true;
    player.style.width = '100%';
    player.style.height = '100%';
    player.style.background = '#404080';
    document.body.innerHTML = null;
    document.body.appendChild(player);
    return player;
}

/*
export async function playHLS() {
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

export async function playVideo() {
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
*/

interface MediaStream {
    //GetSource(): Promise<HTMLSourceElement>;
    GetSource(): Promise<string>;
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
        this.GetSource();
    }

    private async DetectMimeCodec(): Promise<string> {
        return 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'; // 'video/webm; codecs="vorbis,vp8"'
    }

    public async GetSource(): Promise<string> {

        const mediaSource = new MediaSource();
        const uri = URL.createObjectURL(mediaSource);

        this.player.src = uri;

        mediaSource.addEventListener('sourceclose', (event) => {
            console.log('sourceclose', event);
            //URL.revokeObjectURL(uri);
        });

        mediaSource.addEventListener('sourceopen', async (event) => {
            console.log('sourceopen', event);
            const mimeCodec = await this.DetectMimeCodec();
            console.log(mimeCodec, '=>', MediaSource.isTypeSupported(mimeCodec));
            //mediaSource.setLiveSeekableRange(0, 10);
            const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
            const response = await fetch(this.streamURL); // await fetch(this.streamURL);
            const data = await response.arrayBuffer();
            console.log('Data:', data.byteLength);
            sourceBuffer.addEventListener('updateend', () => {
                mediaSource.endOfStream();
                //video.play();
                console.log(mediaSource.readyState); // ended
            });
            sourceBuffer.appendBuffer(data);
        });

        return uri;
    }
}

async function playMediaStream() {
    try {
        const player = createPlayer();
        player.src = 'https://mdn.github.io/dom-examples/sourcebuffer/frag_bunny.mp4';
        //await new MediaStreamMP4(player, 'https://mdn.github.io/dom-examples/sourcebuffer/frag_bunny.mp4').GetSource();
    } catch(error) {
        console.warn(error);
    }
}

playMediaStream();

nw.Window.get().show();

// http://docs.evostream.com/sample_content/assets/sintel1m720p.mp4
// https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov
// https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_stereo.ogg
// .mkv
// .webm
// http://docs.evostream.com/sample_content/assets/hls-sintel-abr3/playlist.m3u8
// http://docs.evostream.com/sample_content/assets/hls-sintel-abr3/sintel480p/playlist.m3u8