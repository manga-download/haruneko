// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaSehri.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangasehri\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasehri', 'Manga Şehri', 'https://mangasehri.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSehri extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangasehri';
        super.label = 'Manga Şehri';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://mangasehri.com';
    }

    async _getPages(chapter) {
        const uri = new URL(chapter.id, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, this.queryPages);
        return data.map(element => this.getAbsolutePath(element.dataset.src || element, request.url)).filter(image => !/grumpybumpers/.test(image));
    }
}
*/