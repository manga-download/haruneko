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

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const urlList = [];
        for (let page = 1, run = true; run; page++) {
            const url = new URL(`${chapter.Identifier}/${page}`, this.URI);
            const response = await Fetch(new Request(url, { method: 'HEAD' }));
            response.redirected && response.url.indexOf('bypass=1') != -1 ? run = false : urlList.push(url);
        }
        return urlList.map(url => new Page(this, chapter, url));
    }
}