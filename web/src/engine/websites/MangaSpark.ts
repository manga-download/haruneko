// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaSpark.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaspark\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaspark', 'مانجا سبارك (MangaSpark)', 'https://mangaspark.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSpark extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaspark';
        super.label = 'مانجا سبارك (MangaSpark)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangaspark.com';
    }
}
*/