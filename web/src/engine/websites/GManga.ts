import { Tags } from '../Tags';
import icon from './GManga.webp';
import { type Chapter, DecoratableMangaScraper, Page, type MangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch } from '../platform/FetchProvider';

function ChapterExtractor(this: MangaScraper, anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: Common.ElementLabelExtractor('span, div').call(this, anchor.querySelector<HTMLHeadingElement>('h5'))
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.card div.row h1', (element) => element.textContent.replace('الفصل', '').trim())
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.series-paginated a.link-series')
@Common.ChaptersSinglePageCSS('div.chapters-list a', ChapterExtractor)
@Common.ImageAjaxFromHTML('div.book-page img.img-fluid')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gmanga', 'GManga', 'https://gmanga.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Aggregator);
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