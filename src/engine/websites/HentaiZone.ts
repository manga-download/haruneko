// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HentaiZone.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hentaizone\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaizone', 'HentaiZone', 'https://hentaizone.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HentaiZone extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hentaizone';
        super.label = 'HentaiZone';
        this.tags = [ 'webtoon', 'hentai', 'french' ];
        this.url = 'https://hentaizone.xyz';
    }
}
*/