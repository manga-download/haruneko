import { Tags } from '../Tags';
import icon from './WhyToon.webp';
import { FetchNextJS } from '../platform/FetchProvider';
import { type Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type HydratedManga = {
    contentSlug: string;
    episodes: {
        no: number;
    }[];
};

type HydratedPages = {
    images: string[];
};

@Common.MangaCSS(/^{origin}\/content\/[^/]+$/, 'h1.leading-tight')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid a.group.block', Common.PatternLinkGenerator('/browse/page/{page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div.content-card-info h3').textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('whytoon', 'WhyToon', 'https://whytoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/`).test(url);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { episodes } = await FetchNextJS<HydratedManga>(new Request(new URL(manga.Identifier, this.URI)), data => 'contentSlug' in data);
        return episodes.reverse().map(({ no }) => new Chapter(this, manga, `${manga.Identifier}/${no}`, `ตอนที่ ${no}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data);
        return images.map(image => new Page(this, chapter, new URL(image, 'https://gd.whytoon.com/')));
    }
}