// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FukushuuNoYuusha.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fnyscantrad', `Fukushuu no Yuusha`, 'https://fny-scantrad.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FukushuuNoYuusha extends WordPressMadara {

    constructor() {
        super();
        super.id = 'fnyscantrad';
        super.label = 'Fukushuu no Yuusha';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://fny-scantrad.com';
    }
}
*/