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
    ) {}
}

class Episode {

    private readonly chunkSize = 1048576; // bytes
    public readonly info: Promise<EpisodeInfo>;

    constructor(private readonly stream: URL) {
        this.info = this.Load();
    }

    private async Load(): Promise<EpisodeInfo> {
        const response = await fetch(this.stream, {
            method: 'GET',
            headers: {
                'X-FetchAPI-Referer': 'https://www.nuevodevel.com/',
            },
        });
        const size = parseInt(response.headers.get('content-length'));
        console.log('Length:', '=>', size);
        console.log('Range:', '=>', response.headers.get('accept-ranges'));
        console.log('Mime:', '=>', response.headers.get('content-type'));
        const reader = response.body.getReader();
        for(let i = 0; i < 3; i++) {
            const { value, done } = await reader.read();
            console.log('Reader:', value, done);
        }
        await reader.cancel();
        return new EpisodeInfo(size, await this.DetectMimeCodec(), 183.71);
    }

    private async DetectMimeCodec(): Promise<string> {
        // 'video/webm; codecs="vorbis,vp8"'
        return 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    }

    public async GetInfo(): Promise<EpisodeInfo> {
        return this.info;
    }

    public async GetChunks(): Promise<Chunk[]> {
        const info = await this.info;
        return new Array(Math.ceil(info.Size / this.chunkSize)).fill(0).map((_, index) => {
            const byteStart = index * this.chunkSize;
            const byteEnd = Math.min(byteStart + this.chunkSize - 1, info.Size - 1)
            const timeStart = 0;
            const timeEnd = 0;
            return new Chunk(this.chunkSize, new Range(byteStart, byteEnd), new Range(timeStart, timeEnd));
        });
    }

    public async FetchChunk(chunk: Chunk): Promise<ArrayBuffer> {
        const response = await fetch(this.stream, {
            headers: {
                'Range': `bytes=${chunk.Bytes.Start}-${chunk.Bytes.End}`,
                'X-FetchAPI-Referer': 'https://www.nuevodevel.com/',
            }
        });
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
        //this.player.onseeked = event => console.log('player.onseeked', '=>', event);
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

        this.mediaSource.setLiveSeekableRange(0, info.Duration);
        //this.mediaSource.removeSourceBuffer(this.mediaSource.sourceBuffers[0]);
        const sourceBuffer = this.mediaSource.addSourceBuffer(info.Codec);
        sourceBuffer.onupdatestart = event => console.log('sourceBuffer.onupdatestart', '=>', event);
        sourceBuffer.onupdate = event => console.log('sourceBuffer.onupdate', '=>', event);
        sourceBuffer.onerror = event => console.warn('sourceBuffer.onerror', event);
        sourceBuffer.onupdateend = event => {
            console.log('sourceBuffer.onupdateend', '=>', event);
            //this.mediaSource.endOfStream();
        };

        for(const chunk of await this.episode.GetChunks()) {
            await new Promise(resolve => setTimeout(resolve, 2500));
            const data = await this.episode.FetchChunk(chunk);
            console.log('Bytes:', data.byteLength);
            sourceBuffer.appendBuffer(data);
        }

        //console.log('TODO: Release current object URL', '=>', this.player.src);
        //this.player.src = URL.createObjectURL(this.mediaSource);
    }
}

export async function PlayMSE(player: HTMLVideoElement, uri: URL) {
    const streamer = new MediaStreamMP4(player);
    const episode = new Episode(uri);
    await streamer.Load(episode);
    await streamer.Play(0);
}