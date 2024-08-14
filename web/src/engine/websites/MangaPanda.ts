import { Tags } from '../Tags';
import icon from './MangaPanda.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ol.breadcrumb li:last-of-type a')
@Common.MangasMultiPageCSS('?page={page}', 'div.media div.media-body > a')
@Common.ChaptersSinglePageCSS('div.content div.chapter-list ul li a')
@Common.PagesSinglePageJS(`document.querySelector('p#arraydata').textContent.trim().split(',');`, 250)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapanda', `MangaPanda`, 'https://www.mangapanda.in', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}