// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NtsVoidScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/voidscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ntsvoidscans', 'Void Scans', 'https://voidscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NtsVoidScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ntsvoidscans';
        super.label = 'Void Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://voidscans.com';
    }
}
*/