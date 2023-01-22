// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KlanKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/klankomik\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('klankomik', 'KlanKomik', 'https://klankomik.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KlanKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'klankomik';
        super.label = 'KlanKomik';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://klankomik.com';
        this.path = '/manga/list-mode/';
    }

}
*/