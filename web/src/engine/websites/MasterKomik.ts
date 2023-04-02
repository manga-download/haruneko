// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MasterKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/masterkomik\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('masterkomik', 'MasterKomik', 'https://masterkomik.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MasterKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'masterkomik';
        super.label = 'MasterKomik';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://masterkomik.com';
        this.path = '/manga/list-mode/';
    }
}
*/