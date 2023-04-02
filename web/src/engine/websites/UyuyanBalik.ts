// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './UyuyanBalik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/uyuyanbalik\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('uyuyanbalik', 'Uyuyan Balık', 'https://uyuyanbalik.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class UyuyanBalik extends WordPressMadara {

    constructor() {
        super();
        super.id = 'uyuyanbalik';
        super.label = 'Uyuyan Balık';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://uyuyanbalik.com';
    }
}
*/