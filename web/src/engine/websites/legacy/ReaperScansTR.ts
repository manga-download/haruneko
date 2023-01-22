// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReaperScansTR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscanstr', `Reaper Scans (Turkish)`, 'https://reaperscanstr.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReaperScansTR extends ReaperScans {

    constructor() {
        super();
        super.id = 'reaperscanstr';
        super.label = 'Reaper Scans (Turkish)';
        this.tags = ['webtoon', 'turkish'];
        this.url = 'https://reaperscanstr.com';
        this.links = {
            login: 'https://reaperscanstr.com/login'
        };
    }
}
*/