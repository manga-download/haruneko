import { Tags } from '../Tags';
import icon from './SenManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

const mangasPerPage = 100;

type JSONManga = {
    id: string,
    title: string,
    description: string,
    language: {
        name: string,
        code: string
    }
}

type JSONChapter = {
    id: string,
    chapter : string,
    full_title: string
    pages: number,
    series : string,
    language: {
        name: string,
        code: string
    }
}

type APISingleManga = {
    success: boolean
    data: JSONManga
}

type APIMultiManga = {
    success: boolean
    data: JSONManga[]
}

type APIMultiChapter = {
    success: boolean
    data: JSONChapter[]
}

const chapterLanguageMap = new Map([
    ['de', Tags.Language.German],
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-la', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    ['id', Tags.Language.Indonesian],
    ['ja', Tags.Language.Japanese],
    ['ko', Tags.Language.Korean],
    ['pt-br', Tags.Language.Portuguese],
    ['ru', Tags.Language.Russian],
    ['th', Tags.Language.Thai],
    ['vi', Tags.Language.Vietnamese],
    ['zh', Tags.Language.Chinese],
    ['zh-hk', Tags.Language.Chinese]
]);

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('senmanga', `SenManga`, 'https://www.senmanga.com', Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('viewer', '1')`);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.split('/').at(-1);
        const { data } = await FetchJSON<APISingleManga>(new Request(new URL(`/api/title/${id}`, this.URI)));
        return new Manga(this, provider, data.id, data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist: Manga[] = [];
        for (let page = 0, run = true; run; page += mangasPerPage) {
            await Delay(500);
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }

        return mangalist.distinct();
    }

    private async GetMangasFromPage(offset: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data, success } = await FetchJSON<APIMultiManga>(new Request(new URL(`/api/search?limit=${mangasPerPage}&offset=${offset}`, this.URI)));
        return success ? data.map(element => new Manga(this, provider, element.id, element.title.trim())) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data, success } = await FetchJSON<APIMultiChapter>(new Request(new URL(`/api/title/${manga.Identifier}/chapters`, this.URI)));
        return success ? data.map(element => new Chapter(this, manga, `/read/${element.id}`, `${element.full_title.trim()} (${element.language.code})`,
            ...chapterLanguageMap.has(element.language.code) ? [chapterLanguageMap.get(element.language.code)] : []
        )) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await Common.FetchPagesSinglePageJS.call(this, chapter, '__NEXT_DATA__.props.pageProps.chapter.pageList.url', 500);
        return images.map(page => new Page(this, chapter, page.Link, { Referer: page.Link.origin }));
    }
}