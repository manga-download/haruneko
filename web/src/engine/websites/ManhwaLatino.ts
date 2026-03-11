import { Tags } from '../Tags';
import icon from './ManhwaLatino.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageCSS()
@Madara.ChaptersSinglePageCSS('ul li.wp-manga-chapter div.mini-letters a')
@Common.PagesSinglePageCSS('div.page-break img.img-responsive', img => img.getAttribute('data-src').trim())
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('manhwalatino', 'Manhwa-Latino', 'https://manhwa-es.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}