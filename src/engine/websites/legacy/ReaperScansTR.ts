// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReaperScansTR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscanstr', `Reaper Scans TR`, 'https://reaperscanstr.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReaperScansTR extends WordPressMadara {

    constructor() {
        super();
        super.id = 'reaperscanstr';
        super.label = 'Reaper Scans TR';
        this.tags = ['webtoon', 'turkish'];
        this.url = 'https://reaperscanstr.com';
        this.queryChapters = 'div.chapter-link > a';
    }
}
*/