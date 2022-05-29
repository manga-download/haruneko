// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './IrisScanlator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/irisscanlator\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('irisscanlator', 'Iris Scanlator', 'https://irisscanlator.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class IrisScanlator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'irisscanlator';
        super.label = 'Iris Scanlator';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://irisscanlator.com';
    }
}
*/