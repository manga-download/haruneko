// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LHTranslation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/lhtranslation\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lhtranslation', 'LHTranslation', 'https://lhtranslation.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LHTranslation extends WordPressMadara {

    constructor() {
        super();
        super.id = 'lhtranslation';
        super.label = 'LHTranslation';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://lhtranslation.net';
    }
}
*/