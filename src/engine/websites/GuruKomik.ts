// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './GuruKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/gurukomik\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gurukomik', 'GuruKomik', 'https://gurukomik.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GuruKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'gurukomik';
        super.label = 'GuruKomik';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://gurukomik.com';
        this.path = '/manga/list-mode/';
    }
}
*/