import { Tags } from '../Tags';
import icon from './ScanVFOrg.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch } from '../platform/FetchProvider';

function MangaLinkExtractor(head: HTMLHeadingElement, uri: URL) {
    return {
        id: uri.pathname,
        title: head.textContent.trim().replace(/Scan VF$/i, '').trim(),
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.card div.row h1', MangaLinkExtractor)
@Common.MangasMultiPageCSS('div.series a.link-series', Common.PatternLinkGenerator('/manga?page={page}'))
@Common.ChaptersSinglePageCSS('div.chapters-list a', undefined, Common.AnchorInfoExtractor(false, 'div.text-muted, div.rate-value'))
@Common.ImageAjaxFromHTML('div.book-page img.img-fluid')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanvforg', 'ScanVF.org', 'https://scanvf.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
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