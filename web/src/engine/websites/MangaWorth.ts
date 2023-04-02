// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaWorth.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaworth\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaworth', 'Manga Worth', 'https://mangaworth.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaWorth extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaworth';
        super.label = 'Manga Worth';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://mangaworth.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/