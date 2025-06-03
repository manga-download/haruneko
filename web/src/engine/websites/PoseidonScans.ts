import { Tags } from '../Tags';
import icon from './PoseidonScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS} from '../platform/FetchProvider';

type HydratedManga = {
    manga: {
        slug: string,
        title: string,
    }
};

type HydratedMangas = {
    mangas: HydratedManga['manga'][]
};

type HydratedChapters = {
    chapters: { number: number }[]
};

type HydratedPages = {
    images: { originalUrl: string }[]
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('poseidonscans', 'Poseidon Scans', 'https://poseidonscans.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/serie/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const request = new Request(new URL(url, this.URI));
        const { manga: { slug, title } } = await FetchNextJS<HydratedManga>(request, data => 'manga' in data);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL('/series', this.URI));
        const { mangas } = await FetchNextJS<HydratedMangas>(request, data => 'mangas' in data);
        return mangas.map(manga => new Manga(this, provider, manga.slug, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/serie/${manga.Identifier}`, this.URI);
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(uri), data => 'chapters' in data);
        return chapters.map(chapter => new Chapter(this, manga, `${uri.pathname}/chapter/${chapter.number}`, `Chapitre ${chapter.number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI));
        const { images } = await FetchNextJS<HydratedPages>(request, data => 'images' in data);
        return images.map(image => new Page(this, chapter, new URL(image.originalUrl, this.URI)));
    }
}