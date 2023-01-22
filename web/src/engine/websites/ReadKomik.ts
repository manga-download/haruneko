// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ReadKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.readkomik\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readkomik', 'ReadKomik', 'https://www.readkomik.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'readkomik';
        super.label = 'ReadKomik';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.readkomik.com';
        this.path = '/manga/list-mode/';
    }
}
*/