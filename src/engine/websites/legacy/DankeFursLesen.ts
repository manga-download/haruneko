// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DankeFursLesen.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dankefurslesen', `Danke fürs Lesen`, 'https://danke.moe' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DankeFursLesen extends Guya {

    constructor() {
        super();
        super.id = 'dankefurslesen';
        super.label = 'Danke fürs Lesen';
        this.tags = [ 'manga', 'english', 'scanlation' ];
        this.url = 'https://danke.moe';
    }
}
*/