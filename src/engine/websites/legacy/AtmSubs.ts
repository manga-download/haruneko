// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AtmSubs.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('atmsubs', `ATM Subs`, 'https://atm-subs.fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AtmSubs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'atmsubs';
        super.label = 'ATM Subs';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://atm-subs.fr';
    }
}
*/