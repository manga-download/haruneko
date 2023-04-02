// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './OniScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.oniscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('oniscans', 'Oniscans', 'https://www.oniscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OniScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'oniscans';
        super.label = 'Oniscans';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://www.oniscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/