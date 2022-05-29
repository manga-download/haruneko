// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaGecesi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangagecesi\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagecesi', 'Manga Gecesi', 'https://mangagecesi.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaGecesi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangagecesi';
        super.label = 'Manga Gecesi';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://mangagecesi.com';
    }
}
*/