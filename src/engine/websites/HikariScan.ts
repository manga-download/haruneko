// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './HikariScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/hikariscan\.com\.br\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hikariscan', 'Hikari Scan', 'https://hikariscan.com.br', Tags.Media.Manga, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HikariScan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'hikariscan';
        super.label = 'Hikari Scan';
        this.tags = [ 'manga', 'portuguese' ];
        this.url = 'https://hikariscan.com.br';
        this.path = '/manga/list-mode/';
    }
}
*/