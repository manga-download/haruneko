// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikuCOM.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komiku\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikucom', 'Komiku.COM', 'https://komiku.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikuCOM extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikucom';
        super.label = 'Komiku.COM';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://komiku.com';
        this.path = '/manga/list-mode/';
    }

    async _getMangaFromURI(uri) {
        const request = new Request(new URL(uri), this.requestOptions);
        const data = await this.fetchDOM(request, this.querMangaTitleFromURI);
        return new Manga(this, uri.pathname, data[0].textContent.trim().replace(/^Komik\s*i, ''));
    }
}
*/