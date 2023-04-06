import { Tags } from '../Tags';
import icon from './DoujinLand.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/doujinland\.my\.id\/series\/[^/]+\/$/, 'div.series-title h2')
@MangaStream.MangasSinglePageCSS('div.mangalist-blc ul li a', '/manga-list/?list')
@MangaStream.ChaptersSinglePageCSS('div.series-chapter ul.series-chapterlist li div.flexch-infoz a', 'span')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujinland', 'DOUJINLAND', 'https://doujinland.my.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}