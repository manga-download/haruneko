// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LazyBoysScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/lazyboysscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lazyboysscan', 'Lazy Boys', 'https://lazyboysscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LazyBoysScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'lazyboysscan';
        super.label = 'Lazy Boys';
        this.tags = [ 'hentai', 'spanish' ];
        this.url = 'https://lazyboysscan.com';
    }
}
*/