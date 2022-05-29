// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GateAnimeManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga\.gateanime\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gateanimemanga', 'GateAnimeMANGA', 'https://manga.gateanime.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GateAnimeManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'gateanimemanga';
        super.label = 'GateAnimeMANGA';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://manga.gateanime.com';
    }
}
*/