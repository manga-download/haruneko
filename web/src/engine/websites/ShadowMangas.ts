// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ShadowMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/shadowmangas\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shadowmangas', 'ShadowMangas', 'https://shadowmangas.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShadowMangas extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'shadowmangas';
        super.label = 'ShadowMangas';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://shadowmangas.com';
        this.path = '/manga/list-mode/';
    }
}
*/