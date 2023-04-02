// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaStreamCC.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.mangastream\.cc\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangastreamcc', 'MangaStream', 'https://www.mangastream.cc'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaStreamCC extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangastreamcc';
        super.label = 'MangaStream';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://www.mangastream.cc';
    }
}
*/