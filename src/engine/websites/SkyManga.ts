// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SkyManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/skymanga\.co\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('skymanga', 'Sky Manga', 'https://skymanga.co'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SkyManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'skymanga';
        super.label = 'Sky Manga';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://skymanga.co';
    }
}
*/