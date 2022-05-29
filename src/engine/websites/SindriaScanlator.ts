// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SindriaScanlator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sindriascanlator\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sindriascanlator', 'Sindria Scanlator', 'https://sindriascanlator.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SindriaScanlator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sindriascanlator';
        super.label = 'Sindria Scanlator';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://sindriascanlator.com';
    }
}
*/