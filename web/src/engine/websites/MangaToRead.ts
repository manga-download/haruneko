// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaToRead.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangatoread\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoread', 'MangaToRead', 'https://mangatoread.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToRead extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangatoread';
        super.label = 'MangaToRead';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangatoread.com';

        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/