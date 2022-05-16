// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReaperScansBR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscansbr', `Reaper Scans (Portuguese)`, 'https://reaperscans.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReaperScansBR extends ReaperScans {

    constructor() {
        super();
        super.id = 'reaperscansbr';
        super.label = 'Reaper Scans (Portuguese)';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://reaperscans.com.br';
        this.links = {
            login: 'https://reaperscans.com.br/login'
        };
    }
}
*/