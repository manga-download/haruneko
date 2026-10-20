import { Tags } from '../Tags';
import icon from './Aftertoon.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedManga = {
    slug: string;
    title: string;
    chapters: {
        slug: string;
        number: string;
        title: string;
    }[];
};

type HydratedPages = {
    pages: {
        imageUrl: string;
    }[];
};

@Common.MangasSinglePageCSS<HTMLAnchorElement>('/manga', 'div.grid > a', anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div[data-slot="card-content"] h3').textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('aftertoon', 'Aftertoon', 'https://aftertoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title, slug } = await FetchNextJS<HydratedManga>(new Request(new URL(url)), data => 'chapters' in data);
        return new Manga(this, provider, `/manga/${slug}`, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedManga>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return chapters.map(({ slug, number, title }) => new Chapter(this, manga, `${manga.Identifier}/${slug}`, ( title ?? number).trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'pages' in data);
        return pages.map(({ imageUrl }) => new Page(this, chapter, new URL(imageUrl, this.URI)));
    }
}