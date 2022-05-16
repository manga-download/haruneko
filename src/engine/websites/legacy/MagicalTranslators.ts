// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MagicalTranslators.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('magicaltranslators', `Magical Translators`, 'https://mahoushoujobu.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MagicalTranslators extends Guya {

    constructor() {
        super();
        super.id = 'magicaltranslators';
        super.label = 'Magical Translators';
        this.tags = [ 'manga', 'english', 'spanish', 'polish', 'scanlation' ];
        this.url = 'https://mahoushoujobu.com';
    }
}
*/