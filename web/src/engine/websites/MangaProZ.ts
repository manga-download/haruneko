// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaProZ.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangaproz\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaproz', 'Manga Pro Z', 'https://mangaproz.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaProZ extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangaproz';
        super.label = 'Manga Pro Z';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangaproz.com';
        this.path = '/manga/list-mode/';
    }
}
*/