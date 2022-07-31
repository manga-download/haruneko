// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikGoID.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.komikgo\.co\.id\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga/?list')
@MangaStream.ChaptersSinglePageCSS('div.bixbox.bxcl ul li span.lchx a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikgoid', 'KomikGo', 'https://www.komikgo.co.id', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikGoID extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikgoid';
        super.label = 'KomikGo';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://www.komikgo.co.id';
        this.path = '/manga/?list';

        this.queryChapters = 'div.bixbox.bxcl ul li span.lchx a';
        this.queryChaptersTitle = undefined;
    }
}
*/