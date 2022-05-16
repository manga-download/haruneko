// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShootingStarScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shootingstarscans', `Shooting Star Scans`, 'https://shootingstarscans.com' /*, Tags.Language.English, Tags ... */);
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