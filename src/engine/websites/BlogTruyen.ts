import { Tags } from '../Tags';
import icon from './AceScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
//import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https?:\/\/blogtruyen\.vn\/[^/]+\//, 'section.manga-detail h1.entry-title')
@Common.MangasMultiPageCSS('/ajax/Search/AjaxLoadListManga?key=tatca&orderBy=1&p={page}', 'div.list p span.tiptip a', 1, 1, 200)
@Common.ChaptersSinglePageCSS('div#list-chapters span.title a')
@Common.PagesSinglePageCSS('article#content img')
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('blogtruyen', `BlogTruyen`, 'https://blogtruyen.vn', Tags.Language.Vietnamese, Tags.Media.Manhua, Tags.Media.Manhua);
    }

    public override get Icon() {
        return icon;
    }
}