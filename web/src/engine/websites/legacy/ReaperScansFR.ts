// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReaperScansFR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscansfr', `Reaper Scans (French)`, 'https://new.reaperscans.fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReaperScansFR extends ReaperScans {
    constructor() {
        super();
        super.id = 'reaperscansfr';
        super.label = 'Reaper Scans (French)';
        this.tags = ['webtoon', 'french'];
        this.url = 'https://new.reaperscans.fr';
        this.links = {
            login: 'https://new.reaperscans.fr/login'
        };
    }
}
*/