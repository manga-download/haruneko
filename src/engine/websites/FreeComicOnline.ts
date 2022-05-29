// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FreeComicOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/freecomiconline\.me\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('freecomiconline', 'Free Comic Online', 'https://freecomiconline.me'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FreeComicOnline extends WordPressMadara {

    constructor() {
        super();
        super.id = 'freecomiconline';
        super.label = 'Free Comic Online';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://freecomiconline.me';
    }
}
*/