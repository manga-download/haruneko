// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './Manhwaland.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/manhwaland\.org\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/series/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaland', 'Manhwaland', 'https://manhwaland.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manhwaland extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'manhwaland';
        super.label = 'Manhwaland';
        this.tags = [ 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://manhwaland.org';
        this.path = '/series/list-mode/';
    }

    async _getMangaFromURI(uri) {
        const manga = await super._getMangaFromURI(uri);
        manga.title = manga.title.replace(/^(manga|manhwa|manhua)/i, '').trim();
        return manga;
    }
}
*/