// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './SkyMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/skymangas\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('skymangas', 'Sky Mangas', 'https://skymangas.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SkyMangas extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'skymangas';
        super.label = 'Sky Mangas';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://skymangas.com';
        this.path = '/manga/list-mode/';
        this.links = {
            login: 'https://skymangas.com/login/'
        };
    }
}
*/