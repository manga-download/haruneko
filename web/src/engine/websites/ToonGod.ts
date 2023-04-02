// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ToonGod.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.toongod\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toongod', 'ToonGod', 'https://www.toongod.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToonGod extends WordPressMadara {

    constructor() {
        super();
        super.id = 'toongod';
        super.label = 'ToonGod';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://www.toongod.com';
    }
}
*/