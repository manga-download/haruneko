import { Tags } from '../Tags';
import icon from './LewdManhwa.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedChapters = {
    chapters: {
        title: string;
        slug: string;
    }[];
};

type HydratedPages = {
    images: {
        filename: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/webtoon\/[^/]+$/, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid div.group > a[href*="/webtoon/"]', Common.PatternLinkGenerator('/webtoons?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.getAttribute('aria-label').trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lewdmanhwa', `LewdManhwa`, 'https://lewdmanhwa.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return chapters.map(({ title, slug }) => new Chapter(this, manga, `${manga.Identifier}/${slug}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data);
        return images.map(({ filename }) => new Page(this, chapter, new URL(filename, 'https://cdn.lewdmanhwa.com/uploads/')));
    }
}