// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaTitan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga-titan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatitan', 'Manga-Titan', 'https://manga-titan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaTitan extends WordPressMadara {
    constructor() {
        super();
        super.id = 'mangatitan';
        super.label = 'Manga-Titan';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'thai' ];
        this.url = 'https://manga-titan.com';

        this.queryTitleForURI = 'div.profile-manga div.post-title h1';
    }
}
*/