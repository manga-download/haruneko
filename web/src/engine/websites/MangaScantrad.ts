// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaScantrad.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga-scantrad\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga-scantrad', 'Manga-Scantrad', 'https://manga-scantrad.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaScantrad extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manga-scantrad';
        super.label = 'Manga-Scantrad';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://manga-scantrad.net';
    }
}
*/