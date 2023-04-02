// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaSepeti.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.mangasepeti\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasepeti', 'Manga Sepeti', 'https://www.mangasepeti.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSepeti extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangasepeti';
        super.label = 'Manga Sepeti';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://www.mangasepeti.com';
    }
}
*/