// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './YuriVerso.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/yuri\.live\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yuriverso', 'Yuri Verso', 'https://yuri.live'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YuriVerso extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yuriverso';
        super.label = 'Yuri Verso';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://yuri.live';
    }
}
*/