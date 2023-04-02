// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaYaku.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangayaku\.my\.id\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangayaku', 'MangaYaku', 'https://mangayaku.my.id'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaYaku extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangayaku';
        super.label = 'MangaYaku';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://mangayaku.my.id';
    }
}
*/