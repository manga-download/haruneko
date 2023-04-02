// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NovelMic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/novelmic\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelmic', 'NovelMic', 'https://novelmic.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelMic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'novelmic';
        super.label = 'NovelMic';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://novelmic.com';
    }
}
*/