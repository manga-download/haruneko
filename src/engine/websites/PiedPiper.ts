// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './PiedPiper.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/piedpiperfansub\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('piedpiperfb', 'Pied Piper', 'https://piedpiperfansub.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PiedPiper extends WordPressMadara {

    constructor() {
        super();
        super.id = 'piedpiperfb';
        super.label = 'Pied Piper';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://piedpiperfansub.com';
    }
}
*/