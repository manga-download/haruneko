// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './CloverManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/clover-manga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('clovermanga', 'Clover Manga', 'https://clover-manga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CloverManga extends WordPressMadara {
    constructor() {
        super();
        super.id = 'clovermanga';
        super.label = 'Clover Manga';
        this.tags = [ 'manga', 'high-quality', 'turkish' ];
        this.url = 'https://clover-manga.com';
        this.language = 'tr';
        this.requestOptions.headers.set( 'x-referer', this.url );
    }
}
*/