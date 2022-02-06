// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SKSubs.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sksubs', `Seven King Scanlation`, 'https://sksubs.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SKSubs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sksubs';
        super.label = 'Seven King Scanlation';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://sksubs.net';
    }
}
*/