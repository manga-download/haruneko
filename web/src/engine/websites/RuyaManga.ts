// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './RuyaManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.ruyamanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ruyamanga', 'Rüya Manga', 'https://www.ruyamanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RuyaManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ruyamanga';
        super.label = 'Rüya Manga';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://www.ruyamanga.com';
    }
}
*/