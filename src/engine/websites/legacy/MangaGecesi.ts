// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaGecesi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagecesi', `Manga Gecesi`, 'https://mangagecesi.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaGecesi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangagecesi';
        super.label = 'Manga Gecesi';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://mangagecesi.com';
    }
}
*/