// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RandomTranslations.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('randomtranslations', `Random Translations`, 'https://randomtranslations.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RandomTranslations extends WordPressMadara {

    constructor() {
        super();
        super.id = 'randomtranslations';
        super.label = 'Random Translations';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://randomtranslations.com';
    }
}
*/