import { Tags } from '../Tags';
import icon from './Jmana1.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname + anchor.search;
    const title = anchor.text;
    return { id, title };
}

@Common.MangaCSS(/^{origin}/, '.books-db-detail a.tit', Common.ElementLabelExtractor(), true)
@Common.MangasMultiPageCSS('/comic_list?page={page}', 'ul li.etc div.txt-wrap a.tit', 1, 1, 10000)
@Common.ChaptersSinglePageCSS('div.lst-wrap ul li div.inner a.tit', ChapterInfoExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jmana1', `제이마나 (Jaymana)`, 'https://kr14.jmana.one', Tags.Language.Korean, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        const request = new Request(uri.href);
        const data = await FetchCSS<HTMLImageElement>(request, 'div.pdf-wrap img.comicdetail');
        return data.filter(page => !page.src.includes('notice'))
            .map(page => new Page(this, chapter, new URL(page.dataset['src'] || page.src), { Referer: uri.href }));
    }
}
