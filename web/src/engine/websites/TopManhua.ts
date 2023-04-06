// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TopManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/topmanhua\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('topmanhua', 'Top Manhua', 'https://topmanhua.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TopManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'topmanhua';
        super.label = 'Top Manhua';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://topmanhua.com';
    }
}
*/