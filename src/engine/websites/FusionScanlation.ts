// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FusionScanlation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/h\.fusionscanlation\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fusionscanlation-hentai', 'H Fusion Scanlation', 'https://h.fusionscanlation.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FusionScanlation extends WordPressMadara {

    constructor() {
        super();
        super.id = 'fusionscanlation-hentai';
        super.label = 'H Fusion Scanlation';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://h.fusionscanlation.com';
    }
}
*/