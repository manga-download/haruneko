// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './CatTranslator.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cat-translator', `Cat-Translator`, 'https://cat-translator.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CatTranslator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'cat-translator';
        super.label = 'Cat-Translator';
        this.tags = [ 'manga', 'webtoon', 'thai' ];
        this.url = 'https://cat-translator.com';
        this.path = '/manga';
    }
}
*/