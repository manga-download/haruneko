// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TeabeerComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/teabeercomics\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('teabeercomics', 'Teabeer Comics', 'https://teabeercomics.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TeabeerComics extends WordPressMadara {

    constructor() {
        super();
        super.id = 'teabeercomics';
        super.label = 'Teabeer Comics';
        this.tags = [ 'comic', 'english' ];
        this.url = 'https://teabeercomics.com';
    }
}
*/