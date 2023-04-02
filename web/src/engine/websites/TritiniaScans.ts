// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TritiniaScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/tritinia\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tritiniascans', 'Tritinia Scans', 'https://tritinia.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TritiniaScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tritiniascans';
        super.label = 'Tritinia Scans';
        this.tags = [ 'webtoon', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://tritinia.com';
    }
}
*/