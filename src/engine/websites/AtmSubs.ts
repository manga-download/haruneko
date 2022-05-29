// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './AtmSubs.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/atm-subs\.fr\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('atmsubs', 'ATM Subs', 'https://atm-subs.fr'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AtmSubs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'atmsubs';
        super.label = 'ATM Subs';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://atm-subs.fr';
    }
}
*/