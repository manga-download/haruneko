// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './CatOnHead.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/catonhead\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('catonhead', 'Cat on Head Translations', 'https://catonhead.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CatOnHead extends WordPressMadara {

    constructor() {
        super();
        super.id = 'catonhead';
        super.label = 'Cat on Head Translations';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://catonhead.com';
    }
}
*/