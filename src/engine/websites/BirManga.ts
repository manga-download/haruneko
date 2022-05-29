// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './BirManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/birmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('birmanga', 'Bir Manga', 'https://birmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BirManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'birmanga';
        super.label = 'Bir Manga';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://birmanga.com';
    }
}
*/