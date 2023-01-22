// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaMitsu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangamitsu\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangamitsu', 'Manga Mitsu', 'https://mangamitsu.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaMitsu extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangamitsu';
        super.label = 'Manga Mitsu';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangamitsu.com';
    }
}
*/