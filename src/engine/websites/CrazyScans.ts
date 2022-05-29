// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './CrazyScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangacultivator\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('crazyscans', 'Crazy Scans', 'https://mangacultivator.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CrazyScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'crazyscans';
        super.label = 'Crazy Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangacultivator.com';
    }
}
*/