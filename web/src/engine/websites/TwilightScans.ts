// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TwilightScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/twilightscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('twilightscans', 'Twilight Scans', 'https://twilightscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TwilightScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'twilightscans';
        super.label = 'Twilight Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://twilightscans.com';
    }
}
*/