import { FetchNextJS } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import * as Common from './decorators/Common';
import icon from './PoseidonScans.webp';

type HydratedManga = {
    manga: {
        slug: string,
        title: string,
    };
};

type HydratedChapters = {
    chapters: { number: number; }[];
};

type HydratedPages = {
    images: { originalUrl: string; }[];
};

@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid a.block.group', Common.PatternLinkGenerator('/series?page={page}'), 0,
    anchor => ({ id: anchor.pathname.split('/').at(-1), title: anchor.querySelector('h2').innerText.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('poseidonscans', 'Poseidon Scans', 'https://poseidonscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
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