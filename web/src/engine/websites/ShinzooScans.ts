// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ShinzooScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/shinzooscan\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shinzooscans', 'Shinzoo Scans', 'https://shinzooscan.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShinzooScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'shinzooscans';
        super.label = 'Shinzoo Scans';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://shinzooscan.xyz';
    }
}
*/