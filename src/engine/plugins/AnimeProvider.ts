import { IMediaContainer, MediaContainer } from './MediaContainer'

export interface IAnimeHost extends IMediaContainer {
    GetMangas: () => Promise<IAnime[]>;
    GetChapters: (manga: IAnime) => Promise<IEpisode[]>;
}

export interface IAnime extends IMediaContainer {
    Host: IAnimeHost;
    GetEpisodes: () => Promise<IEpisode[]>;
}

export interface IEpisode extends IMediaContainer {
    Anime: IAnime;
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