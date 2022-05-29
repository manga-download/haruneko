// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './OlympusScanlation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/olympusscanlation\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('olympusscanlation', 'Olympus Scanlation', 'https://olympusscanlation.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OlympusScanlation extends WordPressMadara {

    constructor() {
        super();
        super.id = 'olympusscanlation';
        super.label = 'Olympus Scanlation';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://olympusscanlation.com';
    }
}
*/