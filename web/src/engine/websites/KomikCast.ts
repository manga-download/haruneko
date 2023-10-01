import { Tags } from '../Tags';
import icon from './KomikCast.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komikcast\.vip\/komik\/[^/]+\/$/, 'h1.komik_info-content-body-title')
@MangaStream.MangasSinglePageCSS('div.text-mode_list-items ul li a.series, div.text-mode_list-items ul li a.text-mode_list-item', '/daftar-komik/?list')
@MangaStream.ChaptersSinglePageCSS('div.komik_info-chapters ul li.komik_info-chapters-item a.chapter-link-item')
@MangaStream.PagesSinglePageCSS([], 'div.main-reading-area img[src^="http"], div.separator img[src^="http"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikcast', 'KomikCast', 'https://komikcast.vip', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}