// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NijiTranslations.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nijitranslations', `مدونة نيجي (Niji Translations)`, 'https://niji-translations.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NijiTranslations extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nijitranslations';
        super.label = 'مدونة نيجي (Niji Translations)';
        this.tags = [ 'manga', 'arabic' ];
        this.url = 'https://niji-translations.com';
    }
}
*/