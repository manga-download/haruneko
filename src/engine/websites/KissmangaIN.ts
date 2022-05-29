// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './KissmangaIN.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/kissmanga\.in\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kissmangain', 'Kissmanga', 'https://kissmanga.in'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KissmangaIN extends WordPressMadara {

    constructor() {
        super();
        super.id = 'kissmangain';
        super.label = 'Kissmanga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://kissmanga.in';
    }
}
*/