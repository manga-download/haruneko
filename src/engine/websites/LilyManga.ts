// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LilyManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/lilymanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lilymanga', 'Lily Manga', 'https://lilymanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LilyManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'lilymanga';
        super.label = 'Lily Manga';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://lilymanga.com';
    }
}
*/