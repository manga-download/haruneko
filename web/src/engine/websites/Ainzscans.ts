import { Tags } from '../Tags';
import icon from './Ainzscans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    title: string;
    slug: string;
    units: APIChapter[];
};

type APIMangas = APIResult<APIManga[]>;

type APIChapter = {
    slug: string;
    number: string;
    sort_number: string;
    pages: {
        image_url: string;
    }[]
};

type APIPages = {
    chapter: APIChapter;
};

function CleanTitle(title: string, mangaTitle: string = '') {
    return (title.replace(mangaTitle, '').replace(/\s+Bahasa\s+Indonesia\s*$/i, '').trim() || title).trim();
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'section h1.text-white', (el, uri) => ({ id: uri.href.split('/').at(-1), title: CleanTitle(el.textContent.trim()) }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.ainzscans01.com/api/';

    public constructor() {
        super('ainzscans', 'Ainzscans', 'https://v1.ainzscans01.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./search?type=COMIC&limit=100&page=${page}&sort=latest&order=desc`, this.apiUrl)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, CleanTitle(title)));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { units } = await FetchJSON<APIManga>(new Request(new URL(`./series/comic/${manga.Identifier}`, this.apiUrl)));
        return units
            .sort((self, other) => parseFloat(other.sort_number) - parseFloat(self.sort_number))
            .map(({ number, slug }) => new Chapter(this, manga, slug, `Chapter ${parseFloat(number) }`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`./series/comic/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ image_url: url }) => new Page(this, chapter, new URL(url, this.apiUrl)));
    }
}