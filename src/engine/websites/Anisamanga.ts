// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Anisamanga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/anisamanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anisamanga', 'Anisa manga', 'https://anisamanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Anisamanga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'anisamanga';
        super.label = 'Anisa manga';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://anisamanga.com';
    }
}
*/