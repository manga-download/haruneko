// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaZukiClub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangazuki\.club\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangazuki-club', 'Mangazuki Raws', 'https://mangazuki.club'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaZukiClub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangazuki-club';
        super.label = 'Mangazuki Raws';
        this.tags = [ 'manga', 'webtoon', 'high-quality', 'raw' ];
        this.url = 'https://mangazuki.club';
    }
}
*/