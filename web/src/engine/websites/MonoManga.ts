// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MonoManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/monomanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('monomanga', 'MonoManga', 'https://monomanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MonoManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'monomanga';
        super.label = 'MonoManga';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://monomanga.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/