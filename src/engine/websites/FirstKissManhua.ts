// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FirstKissManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/1stkissmanhua\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('1stkissmanhua', '1st Kiss Manhua', 'https://1stkissmanhua.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FirstKissManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = '1stkissmanhua';
        super.label = '1st Kiss Manhua';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://1stkissmanhua.com';
    }
}
*/