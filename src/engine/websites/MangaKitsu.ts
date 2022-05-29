// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaKitsu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangakitsu\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakitsu', 'Manga Kitsu', 'https://mangakitsu.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKitsu extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangakitsu';
        super.label = 'Manga Kitsu';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://mangakitsu.com';
    }
}
*/