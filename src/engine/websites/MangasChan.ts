// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangasChan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangaschan\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaschan', 'Mangás Chan', 'https://mangaschan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangasChan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangaschan';
        super.label = 'Mangás Chan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://mangaschan.com';
        this.path = '/manga/list-mode/';
    }
}
*/