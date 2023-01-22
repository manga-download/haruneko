// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './PhoenixFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/phoenixfansub\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('phoenixfansub', 'Phoenix Fansub', 'https://phoenixfansub.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PhoenixFansub extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'phoenixfansub';
        super.label = 'Phoenix Fansub';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://phoenixfansub.com';
        this.path = '/manga/list-mode/';
    }
}
*/