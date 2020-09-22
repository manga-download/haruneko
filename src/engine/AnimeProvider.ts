import { IMediaContainer, MediaContainer } from './MediaContainer';

export interface IAnimeHost extends IMediaContainer {
    GetAnimes(): Promise<IAnime[]>;
    GetEpisodes(anime: IAnime): Promise<IEpisode[]>;
    GetVideo(episode: IEpisode): Promise<IVideo>;
}

export interface IAnime extends IMediaContainer {
    Host: IAnimeHost;
    GetEpisodes(): Promise<IEpisode[]>;
}

export interface IEpisode extends IMediaContainer {
    readonly Anime: IAnime;
    GetVideo(): Promise<IVideo>;
}

export interface IVideo {
    readonly Episode: IEpisode;
    GetPlaylist(): Promise<IPlaylist>;
    GetStream(): Promise<IStream>;
}

export interface IPlaylist {
    readonly Dummy: null;
}

export interface IStream {
    readonly Dummy: null;
}

export class Anime extends MediaContainer {
    //
}

export class Episode extends MediaContainer implements IEpisode, IMediaContainer {

    constructor(identifier: string, title: string, language: string | null, anime: IAnime) {
        super(identifier, title, language, anime);
    }

    get Anime(): IAnime {
        return super.Parent as IAnime;
    }

    public GetVideo(): Promise<IVideo> {
        throw new Error('Not Implemented!');
    }
}

// playlist ?

// stream ?