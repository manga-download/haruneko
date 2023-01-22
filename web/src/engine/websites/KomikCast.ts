// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikCast.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komikcast\.me\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.text-mode_list-items ul li a.series, div.text-mode_list-items ul li a.text-mode_list-item', '/daftar-komik/?list')
@MangaStream.ChaptersSinglePageCSS('div.komik_info-chapters ul li.komik_info-chapters-item a.chapter-link-item')
@MangaStream.PagesSinglePageCSS([], 'div.main-reading-area img[src^="http"], div.separator img[src^="http"]')
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikcast', 'KomikCast', 'https://komikcast.me', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikCast extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikcast';
        super.label = 'KomikCast';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikcast.me';
        this.path = '/daftar-komik/?list';

        this.queryMangas = 'div.text-mode_list-items ul li a.series, div.text-mode_list-items ul li a.text-mode_list-item';
        this.queryChapters = 'div.komik_info-chapters ul li.komik_info-chapters-item a.chapter-link-item';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.main-reading-area img[src^="http"], div.separator img[src^="http"]';
    }
}
*/