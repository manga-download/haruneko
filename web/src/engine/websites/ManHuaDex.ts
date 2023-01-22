// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManHuaDex.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhuadex\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuadex', 'ManHuaDex', 'https://manhuadex.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManHuaDex extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuadex';
        super.label = 'ManHuaDex';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://manhuadex.com';
    }
}
*/