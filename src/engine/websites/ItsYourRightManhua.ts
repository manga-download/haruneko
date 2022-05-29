// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ItsYourRightManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/itsyourightmanhua\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('itsyourightmanhua', 'Its Your Right Manhua', 'https://itsyourightmanhua.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ItsYourRightManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'itsyourightmanhua';
        super.label = 'Its Your Right Manhua';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://itsyourightmanhua.com';
    }
}
*/