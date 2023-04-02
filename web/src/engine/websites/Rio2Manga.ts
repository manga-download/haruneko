// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Rio2Manga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/rio2manga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rio2manga', 'Rio2Manga', 'https://rio2manga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Rio2Manga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'rio2manga';
        super.label = 'Rio2Manga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://rio2manga.com';
    }
}
*/