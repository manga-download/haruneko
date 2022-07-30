// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MarkScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/markscans\.online\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('markscans', 'Mark Scans', 'https://markscans.online'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MarkScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'markscans';
        super.label = 'Mark Scans';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://markscans.online';
    }
}
*/