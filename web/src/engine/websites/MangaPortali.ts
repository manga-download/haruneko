import { Tags } from '../Tags';
import icon from './MangaPortali.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIEntries = {
    items: {
        slug: string;
        title: string;
    }[];
    totalPages: number;
};

type APIChapter = {
    pages: {
        index: number;
        imageUrl: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'h1', (element, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: element.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangaportali', 'Manga Portalı', 'https://www.mangaportali.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items, totalPages } = await FetchJSON<APIEntries>(new Request(new URL(`./series?page=${page}&pageSize=50`, this.apiURL)));
                const mangas = items.map(({ slug, title }) => new Manga(this, provider, slug, title));
                yield* mangas;
                run = page < totalPages;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items, totalPages } = await FetchJSON<APIEntries>(new Request(new URL(`./series/${manga.Identifier}/chapters?page=${page}&pageSize=100`, this.apiURL)));
                const chapters = items.map(({ slug, title }) => new Chapter(this, manga, slug, title));
                yield* chapters;
                run = page < totalPages;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIChapter>(new Request(new URL(`./series/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, this.apiURL)));
        return pages
            .sort((self, other) => self.index - other.index)
            .map(({ imageUrl }) => new Page(this, chapter, new URL(imageUrl)));
    }
}
