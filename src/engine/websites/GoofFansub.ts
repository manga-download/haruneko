// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GoofFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/gooffansub\.com\.br\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gooffansub', 'Goof Fansub', 'https://gooffansub.com.br'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GoofFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'gooffansub';
        super.label = 'Goof Fansub';
        this.tags = [ 'hentai', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://gooffansub.com.br';
    }
}
*/