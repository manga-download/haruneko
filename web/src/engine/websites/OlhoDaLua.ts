// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './OlhoDaLua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/olhodalua\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('olhodalua', 'Olho da Lua', 'https://olhodalua.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OlhoDaLua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'olhodalua';
        super.label = 'Olho da Lua';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://olhodalua.xyz';
    }
}
*/