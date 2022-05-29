// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Hayalistic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hayalistic\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hayalistic', 'Hayalistic', 'https://hayalistic.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Hayalistic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hayalistic';
        super.label = 'Hayalistic';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://hayalistic.com';
    }
}
*/