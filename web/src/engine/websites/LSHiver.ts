// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './LSHiver.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/lshistoria\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lshiver', 'Liebe Schnee Hiver', 'https://lshistoria.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LSHiver extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'lshiver';
        super.label = 'Liebe Schnee Hiver';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://lshistoria.com';
        this.path = '/manga/list-mode/';

        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/