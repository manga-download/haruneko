// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FunList.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/funlist\.online\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('funlist', 'Funlist Online', 'https://funlist.online'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FunList extends WordPressMadara {

    constructor() {
        super();
        super.id = 'funlist';
        super.label = 'Funlist Online';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://funlist.online';
    }
}
*/