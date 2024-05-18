import { Tags } from '../Tags';
import icon from './ArabsHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('span.chapternum').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.sheader div.data h1')
@Common.MangasMultiPageCSS('/manga/page/{page}/', 'article data h3 a')
@Common.ChaptersSinglePageCSS('div#chapter-list ul li a:not(:has(span.chapter-lock))', ChapterExtractor)
@Common.PagesSinglePageCSS('div.chapter_image div.page-break img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('arabshentai', 'ArabsHentai', 'https://arabshentai.com', Tags.Media.Manhwa, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}