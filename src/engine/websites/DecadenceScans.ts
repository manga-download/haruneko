// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DecadenceScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/reader\.decadencescans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('decadencescans', 'Decadence', 'https://reader.decadencescans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DecadenceScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'decadencescans';
        super.label = 'Decadence';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://reader.decadencescans.com';
    }
}
*/