// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HerozScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/herozscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('herozscans', 'Heroz Scans', 'https://herozscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HerozScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'herozscans';
        super.label = 'Heroz Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://herozscans.com';
    }
}
*/