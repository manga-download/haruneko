import { Tags } from '../Tags';
import icon from './ScanVFOrg.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch } from '../platform/FetchProvider';

function MangaLabelExtractor(element: HTMLElement): string {
    return element.textContent.trim().replace(/Scan VF$/i, '').trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.card div.row h1', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.series a.link-series')
@Common.ChaptersSinglePageCSS('div.chapters-list a', Common.AnchorInfoExtractor(false, 'div.text-muted, div.rate-value'))
@Common.ImageAjaxFromHTML('div.book-page img.img-fluid')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanvforg', 'ScanVF.org', 'https://scanvf.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    /**
     * Find all valid page links from the list of generated {@link links}.
     * The generated {@link links} must consist consecutive page links.
     * The length of the generated {@link links} must be a power of two (e.g., 1024).
     */
    private async FilterValidPageLinks(links: URL[], pivot: number = null, step: number = null): Promise<URL[]> {
        step = step ?? links.length >> 2;
        pivot = pivot ?? links.length >> 1;
        const request = new Request(links[pivot - 1], { method: 'HEAD' });
        const response = await Fetch(request);
        if(new URL(response.url).searchParams.get('bypass')) {
            return links.slice(0, pivot);
        } else {
            if(step < 1) return [];
            const offset = response.redirected ? -step : +step;
            return this.FilterValidPageLinks(links, pivot + offset, step >> 1);
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const possibleLinks = new Array(1024).fill(0).map((_, index) => new URL(`${chapter.Identifier}/${index + 1}`, this.URI));
        const pageLinks = await this.FilterValidPageLinks(possibleLinks);
        return pageLinks.map(link => new Page(this, chapter, link));
    }
}