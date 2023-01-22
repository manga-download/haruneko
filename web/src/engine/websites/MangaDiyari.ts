// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaDiyari.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga-diyari\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadiyari', 'MangaDiyari', 'https://manga-diyari.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaDiyari extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangadiyari';
        super.label = 'MangaDiyari';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://manga-diyari.com';
    }
}
*/