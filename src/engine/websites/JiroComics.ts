// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './JiroComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/jirocomics\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jirocomics', 'JiroComics', 'https://jirocomics.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class JiroComics extends WordPressMadara {

    constructor() {
        super();
        super.id = 'jirocomics';
        super.label = 'JiroComics';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://jirocomics.com';
    }
}
*/