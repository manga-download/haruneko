// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './OzulScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/ozulscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ozulscans', 'Ozul Scans', 'https://ozulscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OzulScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'ozulscans';
        super.label = 'Ozul Scans';
        this.tags = ['webtoon', 'arabic'];
        this.url = 'https://ozulscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/