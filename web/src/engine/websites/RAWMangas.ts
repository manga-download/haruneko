// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './RAWMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/rawmangas\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawmangas', 'RAWMangas', 'https://rawmangas.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RAWMangas extends WordPressMadara {

    constructor() {
        super();
        super.id = 'rawmangas';
        super.label = 'RAWMangas';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://rawmangas.net';
    }
}
*/