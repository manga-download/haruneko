// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ToonLatino.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/toonlatinoapp\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonlatino', 'Toon Latino', 'https://toonlatinoapp.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToonLatino extends WordPressMadara {

    constructor() {
        super();
        super.id = 'toonlatino';
        super.label = 'Toon Latino';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://toonlatinoapp.com';
        this.requestOptions.headers.set('x-cookie', 'pll_language=es');
    }
}
*/