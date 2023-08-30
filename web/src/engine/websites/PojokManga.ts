// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './PojokManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/pojokmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pojokmanga', 'PojokManga', 'https://pojokmanga.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PojokManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'pojokmanga';
        super.label = 'PojokManga';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://pojokmanga.com';

        this.queryTitleForURI = 'div.profile-manga div.post-title h1';
    }
}
*/