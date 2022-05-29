// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FukushuuNoYuusha.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/fny-scantrad\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fnyscantrad', 'Fukushuu no Yuusha', 'https://fny-scantrad.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FukushuuNoYuusha extends WordPressMadara {

    constructor() {
        super();
        super.id = 'fnyscantrad';
        super.label = 'Fukushuu no Yuusha';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://fny-scantrad.com';
    }
}
*/