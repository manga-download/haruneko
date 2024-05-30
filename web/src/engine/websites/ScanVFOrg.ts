import { Tags } from '../Tags';
import icon from './ScanVFOrg.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function MangaLabelExtractor(element: HTMLElement): string {
    return element.textContent.trim().replace(/Scan VF$/i, '').trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.card div.row h1', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.series a.link-series')
@Common.ChaptersSinglePageCSS('div.chapters-list a', Common.AnchorInfoExtractor(false, 'div.text-muted, div.rate-value'))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanvforg', 'ScanVF.org', 'https://scanvf.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pagesList : Page[] = [];
        for (let page = 1, run = true; run; page++) {
            const url = new URL(`${chapter.Identifier}/${page}`, this.URI);
            const [ data ] = await FetchCSS<HTMLImageElement>(new Request(url), 'div.book-page img.img-fluid');
            data ? pagesList.push(new Page(this, chapter, new URL(data.getAttribute('src'), this.URI))) : run = false;
        }
        return pagesList;
    }
}