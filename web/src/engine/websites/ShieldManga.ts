// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ShieldManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shieldmanga', 'Shield Manga', 'https://shieldmanga.club'/*, Tags.Media., Tags.Language.*/, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShieldManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'shieldmanga';
        super.label = 'Shield Manga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://shieldmanga.club';

        this.queryChapters = 'li.wp-manga-chapter > a, li.wp-manga-hapter > a';
        this.queryPages = 'div.page-break source, div.page-beak source';
    }
}
*/