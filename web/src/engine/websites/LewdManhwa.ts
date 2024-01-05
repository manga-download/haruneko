import { Tags } from '../Tags';
import icon from './LewdManhwa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('h4.entry-title').textContent.trim();
    return { id, title };
}

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('span.chapter-name').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}/, 'main#main header.entry-header h1.entry-title')
@Common.MangasMultiPageCSS('/webtoons/page/{page}/', 'div#content div.is-list-card div.column a', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.chapter-list div.chapter-list-items a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('span.single-comic-page img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lewdmanhwa', `LewdManhwa`, 'https://lewdmanhwa.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}