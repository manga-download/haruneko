import { Tags } from '../Tags';
import icon from './BlogTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@Common.MangaCSS(/^{origin}\/[^/]+\//, 'section.manga-detail h1.entry-title')
@Common.MangasMultiPageCSS('/ajax/Search/AjaxLoadListManga?key=tatca&orderBy=1&p={page}', 'div.list p span.tiptip a', 1, 1, 200)
@Common.ChaptersSinglePageCSS('div#list-chapters span.title a')
@MangaStream.PagesSinglePageCSS([/donate/], 'article#content img:not([marginheight])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('blogtruyen', `BlogTruyen`, 'https://blogtruyen.vn', Tags.Language.Vietnamese, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
