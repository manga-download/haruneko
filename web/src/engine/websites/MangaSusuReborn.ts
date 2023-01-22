// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaSusuReborn.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangasusu\.biz\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasusureborn', 'MangaSusu Reborn', 'https://mangasusu.biz', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSusuReborn extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangasusureborn';
        super.label = 'MangaSusu Reborn';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://mangasusu.biz';
        this.path = '/manga/list-mode/';
    }
}
*/