// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaZukiOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.mangazuki\.online\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangazuki-online', 'MangaZukiOnline', 'https://www.mangazuki.online'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaZukiOnline extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangazuki-online';
        super.label = 'MangaZukiOnline';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://www.mangazuki.online';
    }
}
*/