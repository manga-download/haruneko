import { Tags } from '../Tags';
import icon from './MangaFr.webp';
import { type Chapter, DecoratableMangaScraper, Page, type MangaScraper } from '../providers/MangaPlugin';
import { Fetch } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

function ChapterExtractor(this: MangaScraper, anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: Common.ElementLabelExtractor('span, div').call(this, anchor.querySelector<HTMLHeadingElement>('h5'))
    };
}

@Common.MangaCSS(/^https:\/\/(www\.)?mangafr\.org\/series\/[^/]+$/, 'div.card div.row h1')
@Common.MangasMultiPageCSS('/series?page={page}', 'div.series-paginated a.link-series')
@Common.ChaptersSinglePageCSS('div.chapters-list a', undefined, ChapterExtractor)
@Common.ImageAjaxFromHTML('div.book-page img.img-fluid')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangafr', 'Manga FR', 'https://mangafr.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const possibleLinks = new Array(1024).fill(0).map((_, index) => new URL(`${chapter.Identifier}/${index + 1}`, this.URI));
        const pageLinks = await possibleLinks.takeUntil(async uri => {
            const response = await Fetch(new Request(uri, { method: 'HEAD' }));
            return new URL(response.url).searchParams.has('bypass') || !response.redirected;
        });
        return pageLinks.map(link => new Page(this, chapter, link));
    }
}