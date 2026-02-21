import { Tags } from '../Tags';
import icon from './SenManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type JSONManga = {
    id: string;
    title: string;
    description: string;
    language: {
        name: string;
        code: string;
    }
};

type JSONChapter = {
    id: string;
    chapter: string;
    full_title: string;
    pages: number;
    series: string;
    language: {
        name: string;
        code: string;
    }
};

type APISingleManga = {
    success: boolean;
    data: JSONManga;
};

type APIMultiManga = {
    success: boolean;
    data: JSONManga[];
};

type APIMultiChapter = {
    success: boolean;
    data: JSONChapter[];
};

const chapterLanguageMap = new Map([
    ['ar', Tags.Language.Arabic],
    //['ca', Tags.Language.Catalan],
    ['de', Tags.Language.German],
    //['el', Tags.Language.Greek],
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-419', Tags.Language.Spanish],
    //['fa', Tags.Language.Persian],
    ['fr', Tags.Language.French],
    //['he', Tags.Language.Hebrew],
    //['hi', Tags.Language.Hindi],
    ['id', Tags.Language.Indonesian],
    ['ja', Tags.Language.Japanese],
    ['ko', Tags.Language.Korean],
    ['pl', Tags.Language.Polish],
    ['pt-BR', Tags.Language.Portuguese],
    ['ru', Tags.Language.Russian],
    ['th', Tags.Language.Thai],
    ['uk', Tags.Language.English],
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
        return new RegExpSafe(`^${this.URI.origin}/title/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { id, title } } = await FetchJSON<APISingleManga>(new Request(new URL(`./api/title/${url.split('/').at(-1)}`, this.URI)));
        return new Manga(this, provider, id, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset+=100) {
                await Delay(500);
                const { data, success } = await FetchJSON<APIMultiManga>(new Request(new URL(`./api/search?limit=100&offset=${offset}`, this.URI)));
                const mangas = success ? data.map(({ id, title }) => new Manga(this, provider, id, title.trim())) : [];
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this))).distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data, success } = await FetchJSON<APIMultiChapter>(new Request(new URL(`./api/title/${manga.Identifier}/chapters`, this.URI)));
        return success ? data.map(({ id, full_title: title, language: { code } }) => new Chapter(this, manga, `/read/${id}`, `${title.trim()} (${code})`,
            ...chapterLanguageMap.has(code) ? [chapterLanguageMap.get(code)] : []
        )) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await Common.FetchPagesSinglePageJS.call(this, chapter, '__NEXT_DATA__.props.pageProps.chapter.pageList.url', 500);
        return images.map(page => new Page(this, chapter, page.Link, { Referer: page.Link.origin }));
    }
}