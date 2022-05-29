// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './JustForFun.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/just-for-fun\.ru\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('justforfun', 'Just for Fun', 'https://just-for-fun.ru'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class JustForFun extends WordPressMadara {

    constructor() {
        super();
        super.id = 'justforfun';
        super.label = 'Just for Fun';
        this.tags = [ 'manga', 'russian' ];
        this.url = 'https://just-for-fun.ru';
    }
}
*/