// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikAV.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komikav\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikav', 'KomikAV', 'https://komikav.com', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikAV extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikav';
        super.label = 'KomikAV';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikav.com';
        this.path = '/manga/list-mode/';
    }
}
*/