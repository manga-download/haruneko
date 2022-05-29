// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ThreeQueensScanlator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/tqscan\.com\.br\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('threequeensscanlator', 'Three Queens Scanlator', 'https://tqscan.com.br'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ThreeQueensScanlator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'threequeensscanlator';
        super.label = 'Three Queens Scanlator';
        this.tags = [ 'webtoon', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://tqscan.com.br';
    }
}
*/