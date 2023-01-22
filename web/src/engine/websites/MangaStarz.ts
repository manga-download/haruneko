// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaStarz.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangastarz\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangastarz', 'مانجا ستارز (Mangastarz)', 'https://mangastarz.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaStarz extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangastarz';
        super.label = 'مانجا ستارز (Mangastarz)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangastarz.com';
    }
}
*/