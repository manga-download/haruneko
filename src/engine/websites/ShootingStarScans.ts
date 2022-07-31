// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ShootingStarScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/shootingstarscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shootingstarscans', 'Shooting Star Scans', 'https://shootingstarscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShootingStarScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'shootingstarscans';
        super.label = 'Shooting Star Scans';
        this.tags = [ 'webtoon', 'english', 'scanlation' ];
        this.url = 'https://shootingstarscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/