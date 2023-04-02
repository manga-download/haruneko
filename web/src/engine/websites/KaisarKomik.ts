// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KaisarKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/kaisarkomik\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga/?list')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kaisarkomik', 'KaisarKomik', 'https://kaisarkomik.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KaisarKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'kaisarkomik';
        super.label = 'KaisarKomik';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://kaisarkomik.com';
        this.path = '/manga/?list';
    }
}
*/