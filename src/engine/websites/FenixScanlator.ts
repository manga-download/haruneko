// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FenixScanlator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/fenixscanlator\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fenixscanlator', 'Fênix Scanlator', 'https://fenixscanlator.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FenixScanlator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'fenixscanlator';
        super.label = 'Fênix Scanlator';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://fenixscanlator.xyz';
    }
}
*/