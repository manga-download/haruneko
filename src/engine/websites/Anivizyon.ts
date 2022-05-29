// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Anivizyon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.anivizyon\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anivizyon', 'Anivizyon', 'https://www.anivizyon.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Anivizyon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'anivizyon';
        super.label = 'Anivizyon';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://www.anivizyon.com';
    }
}
*/