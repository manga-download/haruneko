// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GeceninLordu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/geceninlordu\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('geceninlordu', 'Gecenin Lordu', 'https://geceninlordu.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GeceninLordu extends WordPressMadara {

    constructor() {
        super();
        super.id = 'geceninlordu';
        super.label = 'Gecenin Lordu';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://geceninlordu.com';
    }
}
*/