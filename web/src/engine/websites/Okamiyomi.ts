// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Okamiyomi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/okamiyomi\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('okamiyomi', 'Okamiyomi', 'https://okamiyomi.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Okamiyomi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'okamiyomi';
        super.label = 'Okamiyomi';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://okamiyomi.com';
    }
}
*/