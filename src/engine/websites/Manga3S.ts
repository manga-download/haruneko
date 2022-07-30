// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Manga3S.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga3s\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga3s', 'Manga3S', 'https://manga3s.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manga3S extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manga3s';
        super.label = 'Manga3S';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://manga3s.com';
    }
}
*/