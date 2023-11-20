import { Tags } from '../Tags';
import icon from './ReadComicOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const link = new URL(anchor.href);
    link.searchParams.set('readType', '1');
    link.searchParams.set('quality', 'hq');
    return {
        id: link.pathname + link.search,
        title: anchor.text.trim()
    };
}

function MangInfoExtractor(element: HTMLDivElement) { //needed because titles are truncated in link
    const anchor = element.querySelector<HTMLAnchorElement>('a');
    const dom = new DOMParser().parseFromString(element.getAttribute('title'), 'text/html');
    return {
        id: anchor.pathname,
        title: dom.querySelector('p.title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/Comic\/[^/]+$/, 'div.barContent a.bigChar')
@Common.MangasMultiPageCSS('/ComicList?page={page}', 'div.list-comic div.item, div.item-list div.group div.col.info', 1, 1, 0, MangInfoExtractor)
@Common.ChaptersSinglePageCSS('div.episodeList table.listing tr td:first-of-type a, div.section ul.list li a', ChapterExtractor)
@Common.PagesSinglePageJS('lstImages', 2500) //may trigger a captcha request
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readcomiconline', `ReadComicOnline`, 'https://readcomiconline.li', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}