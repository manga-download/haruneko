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

const chapterLanguageMap = new Map([
    ['ar', Tags.Language.Arabic],
    ['de', Tags.Language.German],
    ['en', Tags.Language.English],
    ['es-419', Tags.Language.Spanish],
    ['es-es', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    ['id', Tags.Language.Indonesian],
    ['it', Tags.Language.Italian],
    ['ja', Tags.Language.Japanese],
    ['ko', Tags.Language.Korean],
    ['pl', Tags.Language.Polish],
    ['pt-br', Tags.Language.Portuguese],
    ['pt-t', Tags.Language.Portuguese],
    ['ru', Tags.Language.Russian],
    ['tr', Tags.Language.Turkish],
    ['zh-hans', Tags.Language.Chinese],
    ['zh-hant', Tags.Language.Chinese]
]);

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.namicomi.com';

    public constructor() {
        super('namicomi', `NamiComi`, 'https://namicomi.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Comic, Tags.Language.Multilingual, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+/title/[^/]+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.split('/').at(-2);
        const { data } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`/title/${id}`, this.apiUrl)));
        const title = (data.attributes.title[data.attributes.originalLanguage] || data.attributes.title.en || Object.values(data.attributes.title).shift()).trim();
        return new Manga(this, provider, data.id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`/title/search?limit=9999&offset=0`, this.apiUrl)));
        return data.map(item => {
            const title = (item.attributes.title[item.attributes.originalLanguage] || item.attributes.title.en || Object.values(item.attributes.title).shift()).trim();
            return new Manga(this, provider, item.id, title);
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`/chapter?titleId=${manga.Identifier}&limit=9999&offset=0`, this.apiUrl)));
        return data.map(item => {
            let title = item.attributes.volume ? `Volume ${item.attributes.volume} ` : '';
            title += item.attributes.chapter ? `Chapter ${item.attributes.chapter} ` : '';
            title += item.attributes.name ? `${item.attributes.name} ` : '';
            title = title.trim() || 'Oneshot';
            title = [title, `[${item.attributes.translatedLanguage}]`].join(' ').trim();
            return new Chapter(this, manga, item.id, title,
                ...chapterLanguageMap.has(item.attributes.translatedLanguage) ? [chapterLanguageMap.get(item.attributes.translatedLanguage)] : []);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data } = await FetchJSON<APIResult<APIPages>>(new Request(new URL(`/images/chapter/${chapter.Identifier}?newQualities=true`, this.apiUrl)));
        return data.high.map(item => {
            const url = new URL(`/chapter/${chapter.Identifier}/${data.hash}/high/${item.filename}`, data.baseUrl);
            return new Page(this, chapter, url);
        });
    }
}