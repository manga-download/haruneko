// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DragonTranslation.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dragontranslation', `DragonTranslation`, 'https://dragontranslation.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DragonTranslation extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'dragontranslation';
        super.label = 'DragonTranslation';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://dragontranslation.com';
        this.path = '/manga/list-mode/';
    }
}
*/