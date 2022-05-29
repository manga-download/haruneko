// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './CutiePie.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/cutiepie\.ga\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cutiepie', 'Cutie Pie', 'https://cutiepie.ga'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CutiePie extends WordPressMadara {

    constructor() {
        super();
        super.id = 'cutiepie';
        super.label = 'Cutie Pie';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://cutiepie.ga';
    }
}
*/