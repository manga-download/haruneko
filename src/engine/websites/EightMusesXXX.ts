// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './EightMusesXXX.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/8muses\.xxx\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('8musesxxx', '8 MUSES XXX', 'https://8muses.xxx'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EightMusesXXX extends WordPressMadara {

    constructor() {
        super();
        super.id = '8musesxxx';
        super.label = '8 MUSES XXX';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://8muses.xxx';
    }
}
*/