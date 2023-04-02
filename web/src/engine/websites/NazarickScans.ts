// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NazarickScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/nazarickscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nazarickscans', 'Nazarick Scans', 'https://nazarickscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NazarickScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nazarickscans';
        super.label = 'Nazarick Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://nazarickscans.com';
    }
}
*/