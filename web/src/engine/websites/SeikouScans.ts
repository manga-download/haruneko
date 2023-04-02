// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SeikouScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/seikouscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('seikouscans', 'Seikou Scans', 'https://seikouscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SeikouScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'seikouscans';
        super.label = 'Seikou Scans';
        this.tags = ['high-quality', 'portuguese', 'scanlation', 'webtoon' ];
        this.url = 'https://seikouscans.com';
    }
}
*/