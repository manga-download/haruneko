import { IMediaContainer, MediaContainer } from './MediaContainer'

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

}

export interface IStream {
    //
}

export class Anime extends MediaContainer {
    //
}

export class Episode extends MediaContainer implements IEpisode, IMediaContainer {

    constructor(identifier: string, title: string, language: string, anime: IAnime) {
        super(identifier, title, language, anime);
    }

    get Anime() {
        return super.Parent as IAnime;
    }
}

// playlist ?

// stream ?