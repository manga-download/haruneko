import { Tags } from '../Tags';
import icon from './MangaBall.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIMangas = APIResult<APIManga[]>;

type APIManga = {
    _id: string;
    name: string;
    slug: string;
};

type APIChapters = {
    grouped_data: APIChapter[];
};

type APIChapter = {
    chapter_number: number;
    releases: {
        id: string;
        lang: string;
        name: string;
        group_name: string;
    }[];
    pages: string[];
};

type APIPages = APIResult<{
    chapter: APIChapter;
}>;

const chapterLanguageMap = new Map([
    ['ar', Tags.Language.Arabic],
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-419', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    // [ 'he', Tags.Language.Hebrew ],
    // [ 'hi', Tags.Language.Hindi ],
    ['id', Tags.Language.Indonesian],
    ['pl', Tags.Language.Polish],
    ['pt-br', Tags.Language.Portuguese],
    ['th', Tags.Language.Thai],
    ['vi', Tags.Language.Vietnamese]
]);

@Common.MangaCSS(/^{origin}\/title-detail\/[^/]+$/, 'p.text-main strong.text-main', (element, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: element.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://mangaball.com/api/v1/';

    public constructor() {
        super('mangaball', 'MangaBall', 'https://mangaball.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./title/search-advanced?adult_mode=all&page=${page}&limit=500`, this.apiURL)));
                const mangas = data.map(({ _id, name, slug }) => new Manga(this, provider, `${slug}-${_id}`, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { grouped_data } = await FetchJSON<APIChapters>(new Request(new URL(`./title/chapter-listing?title_id=${manga.Identifier}&page=${page}&sort_order=desc&group_by=chapter_number&limit=200`, this.apiURL)));
                const chapters = grouped_data.reduce((accumulator: Chapter[], entry) => {
                    const currentChapters = entry.releases.map(({ id, lang, group_name: group }) => new Chapter(this, manga, id, [`Chapter ${entry.chapter_number} [${group}]`, `[${lang}]`].joinTitleSegments(), ...[chapterLanguageMap.get(lang)].filter(Boolean)));
                    accumulator.push(...currentChapters);
                    return accumulator;
                }, []);
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapter: { pages } } } = await FetchJSON<APIPages>(new Request(new URL(`./chapter-detail?chapter_id=${chapter.Identifier}`, this.apiURL)));
        return pages.map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }
}