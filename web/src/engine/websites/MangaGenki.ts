// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaGenki.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangagenki\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga/?list')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagenki', 'MangaGenki', 'https://mangagenki.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaGenki extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangagenki';
        super.label = 'MangaGenki';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangagenki.com';
        this.path = '/manga/?list';
    }
}
*/