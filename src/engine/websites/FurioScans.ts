// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FurioScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/furioscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('furioscans', 'Furio Scans', 'https://furioscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FurioScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'furioscans';
        super.label = 'Furio Scans';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://furioscans.com';
    }
}
*/