import { Tags } from '../Tags';
import icon from './MangaDex.webp';
import { FetchRequest, FetchJSON } from '../FetchProvider';
import { MangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/TaskPool';
import * as Common from './decorators/Common';

type APIContainer<T> = {
    data: T
}

type APIManga = {
    id: string
    attributes: {
        title: Record<string, string>
        createdAt: string
    }
    relationships: {
        id: string
        type: string
    }[]
}

type APIChapter = {
    id: string
    attributes: {
        volume?: string
        chapter?: string
        title: string
        translatedLanguage: string
    }
    relationships: {
        id: string
        type: string
        attributes: {
            name: string
        }
    }[]
}

type APIMedia = {
    baseUrl: string
    chapter: {
        hash: string
        data: string[]
    }
}

const chapterLanguageMap = {
    //NULL: Tags.Language.Other,
    ar: Tags.Language.Arabic,
    //bn: Tags.Language.Bengali,
    //bg: Tags.Language.Bulgarian,
    //my: Tags.Language.Burmese,
    //ca: Tags.Language.Catalan,
    zh: Tags.Language.Chinese,
    //cs: Tags.Language.Czech,
    //da: Tags.Language.Danish,
    //nl: Tags.Language.Dutch,
    en: Tags.Language.English,
    //fi: Tags.Language.Finnish,
    fr: Tags.Language.French,
    de: Tags.Language.German,
    //el: Tags.Language.Greek,
    //he: Tags.Language.Hebrew,
    //hi: Tags.Language.Hindi,
    //hu: Tags.Language.Hungarian,
    id: Tags.Language.Indonesian,
    it: Tags.Language.Italian,
    ja: Tags.Language.Japanese,
    ko: Tags.Language.Korean,
    //lt: Tags.Language.Lithuanian,
    //ms: Tags.Language.Malay,
    //mn: Tags.Language.Mongolian,
    //ne: Tags.Language.Nepali,
    //no: Tags.Language.Norwegian,
    //fa: Tags.Language.Persian,
    pl: Tags.Language.Polish,
    pt: Tags.Language.Portuguese,
    //ro: Tags.Language.Romanian,
    ru: Tags.Language.Russian,
    //sh: Tags.Language.Serbo-Croatian,
    es: Tags.Language.Spanish,
    //sv: Tags.Language.Swedish,
    //tl: Tags.Language.Tagalog,
    th: Tags.Language.Thai,
    tr: Tags.Language.Turkish,
    //uk: Tags.Language.Ukrainian,
    vi: Tags.Language.Vietnamese
};

export default class extends MangaScraper {

    private readonly api = 'https://api.mangadex.org'; // 163.47.176.14
    private readonly licensedChapterGroups = [
        '4f1de6a2-f0c5-4ac5-bce5-02c7dbb67deb', // MangaPlus
        '8d8ecf83-8d42-4f8c-add8-60963f9f28d9' // Comikey
    ];

    public constructor() {
        super('mangadex', 'MangaDex', 'https://mangadex.org', Tags.Language.Multilingual);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/mangadex\.org\/title\//.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const regexGUID = /[a-fA-F0-9]{8}-([a-fA-F0-9]{4}-){3}[a-fA-F0-9]{12}/;
        const id = (uri.pathname.match(regexGUID) || uri.hash.match(regexGUID))[0].toLowerCase();
        const request = new FetchRequest(`${this.api}/manga/${id}`, { headers: { Referer: this.URI.href }});
        const { data: { attributes: { title: titles } } } = await FetchJSON<APIContainer<APIManga>>(request);
        const title = titles.en || Object.values(titles).shift();
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const limit = 100;
        let lastCreatedAt = '2000-01-01T00:00:00';
        let throttle = Promise.resolve();
        while(lastCreatedAt) {
            await throttle;
            throttle = new Promise(resolve => setTimeout(resolve, 250));

            const uri = new URL('/manga', this.api);
            uri.searchParams.set('limit', `${limit}`);
            uri.searchParams.set('order[createdAt]', 'asc');
            uri.searchParams.set('createdAtSince', lastCreatedAt);
            uri.searchParams.append('contentRating[]', 'safe');
            uri.searchParams.append('contentRating[]', 'suggestive');
            uri.searchParams.append('contentRating[]', 'erotica');
            uri.searchParams.append('contentRating[]', 'pornographic');

            const request = new FetchRequest(uri.href, { headers: { Referer: this.URI.href }});
            const { data } = await FetchJSON<APIContainer<APIManga[]>>(request);

            lastCreatedAt = data.length === limit ? data.pop().attributes.createdAt.split('+').shift() : null;

            if(data.length) {
                const mangas = data.map(manga => {
                    const title = manga.attributes.title.en || Object.values(manga.attributes.title).shift();
                    return new Manga(this, provider, manga.id, title);
                });
                mangaList.push(...mangas);
            }
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        let throttle = Promise.resolve();
        for(let page = 0, run = true; run; page++) {
            await throttle;
            throttle = new Promise(resolve => setTimeout(resolve, 250));
            const chapters = await this.FetchChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async FetchChaptersFromPage(manga: Manga, page: number) {

        function pad(number: string, places: number): string {
            // '17', '17.5', '17-17.5', '17 - 17.5', '17-123456789'
            return number.split('-').map(chapter => {
                chapter = chapter.trim();
                const digits = chapter.split('.')[0].length;
                return '0'.repeat(Math.max(0, places - digits)) + chapter;
            }).join('-');
        }

        const uri = new URL('/chapter', this.api);
        uri.searchParams.set('limit', '100');
        uri.searchParams.set('offset', `${100 * page}`);
        uri.searchParams.set('manga', manga.Identifier);
        uri.searchParams.append('includes[]', 'scanlation_group');
        uri.searchParams.append('contentRating[]', 'safe');
        uri.searchParams.append('contentRating[]', 'suggestive');
        uri.searchParams.append('contentRating[]', 'erotica');
        uri.searchParams.append('contentRating[]', 'pornographic');

        const request = new FetchRequest(uri.href, { headers: { Referer: this.URI.href }});
        const { data } = await FetchJSON<APIContainer<APIChapter[]>>(request);

        return !data ? [] : data.map(entry => {
            let title = '';
            if(entry.attributes.volume) {
                title += 'Vol.' + pad(entry.attributes.volume, 2);
            }
            if(entry.attributes.chapter) {
                title += ' Ch.' + pad(entry.attributes.chapter, 4);
            }
            if(entry.attributes.title) {
                title += (title ? ' - ' : '') + entry.attributes.title;
            }
            if(entry.attributes.translatedLanguage) {
                title += ' (' + entry.attributes.translatedLanguage + ')';
            }
            const groups = entry.relationships.filter(relation => relation.type === 'scanlation_group');
            if(groups.length > 0) {
                title += ' [' + groups.map(group => group.attributes.name).join(', ') + ']';
            }
            if(groups.length === 0 || groups.some(group => !this.licensedChapterGroups.includes(group.id))) {
                const chapter = new Chapter(this, manga, entry.id, title.trim());
                const languageCode = entry.attributes.translatedLanguage?.split('-')?.shift();
                if(languageCode && chapterLanguageMap[languageCode]) {
                    chapter.Tags.push(chapterLanguageMap[languageCode]);
                }
                return chapter;
            } else {
                return false;
            }
        }).filter(chapter => chapter);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(`${this.api}/at-home/server/${chapter.Identifier}`, { headers: { Referer: this.URI.href }});
        const { baseUrl, chapter: { hash, data: files } } = await FetchJSON<APIMedia>(request);
        return files.map(file => {
            const slug = [ '/data', hash, file ].join('/');
            const parameters = { Referer: this.URI.href, Base: baseUrl, Slug: slug };
            return new Page(this, chapter, new URL(baseUrl + slug), parameters);
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {

        async function download(this: MangaScraper, page: Page, server: string): Promise<Blob> {
            const source = new Page(this, page.Parent as Chapter, new URL(server + page.Parameters.Slug), page.Parameters);
            const blob: Blob = await Common.FetchImageAjax.call(this, source, priority, signal, false);
            (await createImageBitmap(blob)).close();
            return blob;
        }

        try {
            return await download.call(this, page, 'https://uploads.mangadex.org');
        } catch {
            return download.call(this, page, page.Parameters.Base as string);
        }
    }
}