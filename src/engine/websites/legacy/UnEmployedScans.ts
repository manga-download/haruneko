// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './UnEmployedScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('unemployedscans', `Unemployed Scans`, 'https://unemployedscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class UnEmployedScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'unemployedscans';
        super.label = 'Unemployed Scans';
        this.tags = ['webtoon', 'english'];
        this.url = 'https://unemployedscans.com';
    }
}
*/