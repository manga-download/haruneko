// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaKeyfi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangakeyfi\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakeyfi', 'Manga Keyfi', 'https://mangakeyfi.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKeyfi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangakeyfi';
        super.label = 'Manga Keyfi';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://mangakeyfi.net';
    }
}
*/