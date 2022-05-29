// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DetectiveConanAR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.manga\.detectiveconanar\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('detectiveconanar', 'العربية  كونان (Conan Arabic)', 'https://www.manga.detectiveconanar.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DetectiveConanAR extends WordPressMadara {

    constructor() {
        super();
        super.id = 'detectiveconanar';
        super.label = 'العربية  كونان (Conan Arabic)';
        this.tags = [ 'manga', 'arabic' ];
        this.url = 'https://www.manga.detectiveconanar.com';
    }
}
*/