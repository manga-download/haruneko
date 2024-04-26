import { Tags } from '../Tags';
import icon from './BlogTruyenMoi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';
function MangaLabelExtractor(element: HTMLMetaElement): string {
    return element.content.split('|')[0].trim();
}

@Common.MangaCSS(/^{origin}\/[^/]+\//, 'meta[property="og:title"]', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/ajax/Search/AjaxLoadListManga?key=tatca&orderBy=1&p={page}', 'div.list p span.tiptip a', 1, 1, 200)
@Common.ChaptersSinglePageCSS('div#list-chapters span.title a')
@MangaStream.PagesSinglePageCSS([/donate/, /\/btm.png/], 'article#content img:not([marginheight])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('blogtruyenmoi', `BlogTruyenMoi`, 'https://blogtruyenmoi.com', Tags.Language.Vietnamese, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}