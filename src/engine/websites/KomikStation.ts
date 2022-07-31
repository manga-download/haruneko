// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikStation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.komikstation\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga/?list')
@MangaStream.ChaptersSinglePageCSS('div.bxcl ul li span.lchx a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikstation', 'KomikStation', 'https://www.komikstation.com', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikStation extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikstation';
        super.label = 'KomikStation';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://www.komikstation.com';
        this.path = '/manga/?list';

        this.queryMangas = 'div#content div.soralist ul li a.series';
        this.queryChapters = 'div.bxcl ul li span.lchx a';
        this.queryChaptersTitle = undefined;
    }
}
*/