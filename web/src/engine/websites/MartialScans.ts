// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MartialScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/martialscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('martialscans', 'Martial Scans', 'https://martialscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MartialScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'martialscans';
        super.label = 'Martial Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://martialscans.com';

        this.queryMangas = 'div.post-title h3 a:not([target]), div.post-title h5 a:not([target])';
    }
}
*/