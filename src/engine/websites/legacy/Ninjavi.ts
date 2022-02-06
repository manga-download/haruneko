// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Ninjavi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ninjavi', `NINJAVI`, 'https://ninjavi.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Ninjavi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ninjavi';
        super.label = 'NINJAVI';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://ninjavi.com';
    }
}
*/