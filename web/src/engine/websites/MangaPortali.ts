import { Tags } from '../Tags';
import icon from './MangaPortali.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIPaginated<T> = {
    items: T[];
    totalPages: number;
};

type APIEntry = {
    slug: string;
    title: string;
};

type APIChapter = {
    pages: {
        index: number;
        imageUrl: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'h1')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaportali', 'Manga Portalı', 'https://www.mangaportali.com', Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, totalPages = 1; page <= totalPages; page++) {
                const uri = new URL('/api/series', this.URI);
                uri.searchParams.set('page', `${page}`);
                uri.searchParams.set('pageSize', '20');
                const data = await FetchJSON<APIPaginated<APIEntry>>(new Request(uri));
                totalPages = data.totalPages;
                yield* data.items.map(({ slug, title }) => new Manga(this, provider, `/series/${slug}`, title));
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = manga.Identifier.split('/').pop();
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, totalPages = 1; page <= totalPages; page++) {
                const uri = new URL(`/api/series/${slug}/chapters`, this.URI);
                uri.searchParams.set('page', `${page}`);
                const data = await FetchJSON<APIPaginated<APIEntry>>(new Request(uri));
                totalPages = data.totalPages;
                yield* data.items.map(chapter => new Chapter(this, manga, `/reader/${slug}/${chapter.slug}`, chapter.title));
            }
        }.call(this)).then(chapters => chapters.reverse());
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [ , , mangaSlug, chapterSlug ] = chapter.Identifier.split('/');
        const uri = new URL(`/api/series/${mangaSlug}/chapters/${chapterSlug}`, this.URI);
        const { pages } = await FetchJSON<APIChapter>(new Request(uri));
        return pages
            .sort((self, other) => self.index - other.index)
            .map(page => new Page(this, chapter, new URL(page.imageUrl)));
    }
}
