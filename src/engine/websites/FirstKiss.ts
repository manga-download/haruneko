// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FirstKiss.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/1stkissmanga\.io\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('firstkiss', '1st Kiss Manga', 'https://1stkissmanga.io'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FirstKiss extends WordPressMadara {

    constructor() {
        super();
        super.id = 'firstkiss';
        super.label = '1st Kiss Manga';
        this.tags = ['webtoon', 'english'];
        this.url = 'https://1stkissmanga.io';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/