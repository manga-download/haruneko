import { Tags } from '../Tags';
import icon from './TenshiManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedPages = {
    series_items: {
        path: string;
    }[];
};

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('h3.chapternum').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'div.content-info img', (element: HTMLImageElement) => element.alt.trim())
@Common.MangasMultiPageCSS('search?page={page}', 'section[aria-label*="series"] div.card > div a:has(h2)')
@Common.ChaptersSinglePageCSS('div.list-episode a', ChapterExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly cdnUrl = 'https://tenshi.efsaneler.can.re/'; // 'https://manga1.efsaneler.can.re/'

    public constructor () {
        super('tenshimanga', 'Tenshi Manga', 'https://tenshimanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { series_items } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'series_items' in data);
        return series_items.map(({ path }) => new Page(this, chapter, new URL(path, this.cdnUrl)));
    }
}