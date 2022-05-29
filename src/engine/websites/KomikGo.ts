// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './KomikGo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/komikgo\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikgo', 'KomikGo', 'https://komikgo.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikGo extends WordPressMadara {

    constructor() {
        super();
        super.id = 'komikgo';
        super.label = 'KomikGo';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikgo.com';
    }
}
*/