// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GuncelManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/guncelmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('guncelmanga', 'Güncel Manga', 'https://guncelmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GuncelManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'guncelmanga';
        super.label = 'Güncel Manga';
        this.tags = [ 'manga', 'turkish' ];
        this.url = 'https://guncelmanga.com';
    }
}
*/