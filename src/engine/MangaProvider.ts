import { IMedia, Media, IMediaContainer, MediaContainer } from './MediaContainer';

export interface IMangaHost extends IMediaContainer {
    GetMangas(): Promise<IManga[]>;
    GetChapters(manga: IManga): Promise<IChapter[]>;
    GetPages(chapter: IChapter): Promise<IPage[]>;
}

export interface IManga extends IMediaContainer {
    Host: IMangaHost;
    GetChapters(): Promise<IChapter[]>;
}

export interface IChapter extends IMediaContainer {
    Manga: IManga;
    GetPages(): Promise<IPage[]>;
}

export interface IPage extends IMedia {
    Chapter: IChapter;
    GetImage(): Promise<string>;
}

export class Manga extends MediaContainer implements IManga {

    constructor(identifier: string, title: string, language: string | null, host: IMangaHost) {
        super(identifier, title, language, host);
    }

    get Host(): IMangaHost {
        return super.Parent as IMangaHost;
    }

    async GetChapters(): Promise<IChapter[]> {
        return this.Host.GetChapters(this);
    }
}

export class Chapter extends MediaContainer implements IChapter, IMediaContainer {

    constructor(identifier: string, title: string, language: string, manga: IManga) {
        super(identifier, title, language, manga);
    }

    get Manga(): IManga {
        return super.Parent as IManga;
    }

    async GetPages(): Promise<IPage[]> {
        return this.Manga.Host.GetPages(this);
    }
}

export class Page extends Media implements IPage {

    private readonly _image: string;

    constructor(image: string, chapter: IChapter) {
        super(chapter);
        this._image = image;
    }

    get Chapter(): IChapter {
        return super.Parent as IChapter;
    }

    public async GetImage(): Promise<string> {
        return this._image;
    }
}