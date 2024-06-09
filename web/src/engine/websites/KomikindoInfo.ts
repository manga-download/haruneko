import { Tags } from '../Tags';
import icon from './KomikindoInfo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

//Note : use Zmanga WP theme. May issue a template in the future
@MangaStream.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'div.series-title h2')
@MangaStream.MangasSinglePageCSS('div.mangalist-blc ul li.Manga a.series', '/manga-list/')
@MangaStream.ChaptersSinglePageCSS('div.series-chapter ul.series-chapterlist li div.flexch-infoz a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindoinfo', 'KomikindoInfo', 'https://komikindo.info', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}