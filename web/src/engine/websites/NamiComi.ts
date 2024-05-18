import { Tags } from '../Tags';
import icon from './NamiComi.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    result: string,
    data: T
};

type APIManga = {
    id: string,
    attributes: {
        originalLanguage: string,
        title: {
            [lang: string]: string
        }
    }
}

type APIChapter = {
    id: string,
    attributes: {
        volume: null | string,
        chapter: string,
        name: null | string,
        translatedLanguage: string
    }
}

type APIPages = {
    baseUrl: string,
    hash: string,
    high: {
        filename: string
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.namicomi.com';
    private readonly mangaRegexp = new RegExp(`^${this.URI.origin}/[^/]+/title/(\[^/]+)\/[^/]+$`);
    public constructor() {
        super('namicomi', `NamiComi`, 'https://namicomi.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Comic, Tags.Language.Multilingual, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.match(this.mangaRegexp)[1];
        const request = new Request(new URL(`/title/${id}`, this.apiUrl));
        const { data } = await FetchJSON<APIResult<APIManga>>(request);
        const title = (data.attributes.title[data.attributes.originalLanguage] || data.attributes.title.en).trim();
        return new Manga(this, provider, data.id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL(`/title/search?limit=9999&offset=0`, this.apiUrl));
        const { data } = await FetchJSON<APIResult<APIManga[]>>(request);
        return data.map(item => {
            const title = (item.attributes.title[item.attributes.originalLanguage] || item.attributes.title.en).trim();
            return new Manga(this, provider, item.id, title);
        });
    }
    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/chapter?titleId=${manga.Identifier}&limit=9999&offset=0`, this.apiUrl));
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(request);
        return data.map(item => {
            let title = item.attributes.name ? `${item.attributes.chapter} ${item.attributes.name}` : `Volume ${item.attributes.volume} Episode ${item.attributes.chapter}`;
            title = [title, `[${item.attributes.translatedLanguage}]`].join(' ').trim();
            return new Chapter(this, manga, item.id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/images/chapter/${chapter.Identifier}?newQualities=true`, this.apiUrl));
        const { data } = await FetchJSON<APIResult<APIPages>>(request);
        return data.high.map(item => {
            const url = new URL(`/chapter/${chapter.Identifier}/${data.hash}/high/${item.filename}`, data.baseUrl);
            return new Page(this, chapter, url);
        });
    }
}