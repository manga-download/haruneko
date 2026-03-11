import { Tags } from '../Tags';
import icon from './TruyenTranhtuan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.comic-title-detail')
@Common.MangasMultiPageCSS('h3.comic-title a', Common.PatternLinkGenerator('/page/{page}/?s'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.chapter-row', undefined, element => ({ id: element.pathname, title: element.querySelector('.chapter-left').textContent.trim() }))
@Common.PagesSinglePageCSS('div.chapter-image img[data-lazy-src]', element => element.dataset.lazySrc)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyentranhtuan', 'TruyenTranhtuan', 'https://truyentranhtuan.me', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}