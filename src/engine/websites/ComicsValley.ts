// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ComicsValley.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/comicsvalley\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicsvalley', 'Comics Valley', 'https://comicsvalley.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicsValley extends WordPressMadara {

    constructor() {
        super();
        super.id = 'comicsvalley';
        super.label = 'Comics Valley';
        this.tags = [ 'porn', 'english' ];
        this.url = 'https://comicsvalley.com';
    }
}
*/