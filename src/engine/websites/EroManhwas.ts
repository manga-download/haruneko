// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './EroManhwas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/eromanhwas\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('eromanhwas', 'Eromanhwas', 'https://eromanhwas.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EroManhwas extends WordPressMadara {

    constructor() {
        super();
        super.id = 'eromanhwas';
        super.label = 'Eromanhwas';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://eromanhwas.com';
    }
}
*/