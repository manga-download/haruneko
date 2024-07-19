import { Tags } from '../Tags';
import icon from './KomikCast.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'h1.komik_info-content-body-title')
@MangaStream.MangasSinglePageCSS('div.text-mode_list-items ul li a.series, div.text-mode_list-items ul li a.text-mode_list-item', '/daftar-komik/?list')
@MangaStream.ChaptersSinglePageCSS('div.komik_info-chapters ul li.komik_info-chapters-item a.chapter-link-item')
@MangaStream.PagesSinglePageCSS([/999\.jpg/], 'div.main-reading-area img.alignnone, div.separator img.alignnone')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('komikcast', 'KomikCast', 'https://komikcast.cz', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}