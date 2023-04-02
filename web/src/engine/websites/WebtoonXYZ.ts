// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './WebtoonXYZ.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.webtoon\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webtoonxyz', 'WebtoonXYZ', 'https://www.webtoon.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WebtoonXYZ extends WordPressMadara {

    constructor() {
        super();
        super.id = 'webtoonxyz';
        super.label = 'WebtoonXYZ';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.webtoon.xyz';

        // NOTE : in case they fix the structure
        this.queryMangas = 'div.post-title h3 a, div.post-title h5 a, div.post-title .h5 a';
    }
}
*/