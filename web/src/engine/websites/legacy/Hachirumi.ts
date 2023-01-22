// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Hachirumi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hachirumi', `Hachirumi`, 'https://hachirumi.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Hachirumi extends Guya {

    constructor() {
        super();
        super.id = 'hachirumi';
        super.label = 'Hachirumi';
        this.tags = [ 'manga', 'english', 'scanlation' ];
        this.url = 'https://hachirumi.com';
    }
}
*/