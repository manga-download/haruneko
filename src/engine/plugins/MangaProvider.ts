import { IMediaContainer, MediaContainer } from './MediaContainer'

export interface IMangaHost extends IMediaContainer {
    GetMangas: () => Promise<IManga[]>;
    GetChapters: (manga: IManga) => Promise<IChapter[]>;
}

export interface IManga extends IMediaContainer {
    Host: IMangaHost;
    GetChapters: () => Promise<IChapter[]>;
}

export interface IChapter extends IMediaContainer {
    Manga: IManga;
}

export class Manga extends MediaContainer implements IManga {

    constructor(identifier: string, title: string, language: string, host: IMangaHost) {
        super(identifier, title, language, host);
    }

    get Host() {
        return super.Parent as IMangaHost;
    }

    async GetChapters() {
        return this.Host.GetChapters(this);
    }
}

export class Chapter extends MediaContainer implements IChapter, IMediaContainer {

    constructor(identifier: string, title: string, language: string, manga: IManga) {
        super(identifier, title, language, manga);
    }

    get Manga() {
        return super.Parent as IManga;
    }
}