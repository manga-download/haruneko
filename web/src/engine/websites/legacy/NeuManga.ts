import { Tags } from '../../Tags';
import icon from './NeuManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^https?:\/\/neumanga\.net\/series\/[^/]+\/$/, 'div.series-title h2')
@Common.MangasSinglePageCSS('/manga-list/', 'div.mangalist-blc ul li a.series')
@Common.ChaptersSinglePageCSS('ul.series-chapterlist li div.flexch-infoz a', Common.AnchorInfoExtractor(false, 'span.date'))
@Common.PagesSinglePageCSS('div.reader-area p img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('neumanga', `NeuManga`, 'https://neumanga.net', Tags.Language.Indonesian, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}
