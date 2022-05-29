// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DarkYueRealm.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/darkyuerealm\.site\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('darkyuerealm', 'DarkYue Realm', 'https://darkyuerealm.site'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DarkYueRealm extends WordPressMadara {

    constructor() {
        super();
        super.id = 'darkyuerealm';
        super.label = 'DarkYue Realm';
        this.tags = [ 'manga', 'portuguese' ];
        this.url = 'https://darkyuerealm.site';
        this.path = '/web';
    }
}
*/