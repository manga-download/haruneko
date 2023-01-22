// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaEclipse.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaeclipse\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaeclipse', 'Manga Eclipse', 'https://mangaeclipse.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaEclipse extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaeclipse';
        super.label = 'Manga Eclipse';
        this.tags = ['webtoon', 'english'];
        this.url = 'https://mangaeclipse.com';

        this.requestOptions.headers.set('x-referer', this.url);
    }

}
*/