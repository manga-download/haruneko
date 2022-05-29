// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SkyManhwa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/skymanhwa\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('skymanhwa', 'Skymanhwa', 'https://skymanhwa.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SkyManhwa extends WordPressMadara {

    constructor() {
        super();
        super.id = 'skymanhwa';
        super.label = 'Skymanhwa';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://skymanhwa.com';
    }
}
*/