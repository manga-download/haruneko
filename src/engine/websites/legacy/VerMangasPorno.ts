// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './VerMangasPorno.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vermangasporno', `VerMangasPorno`, 'https://vermangasporno.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class VerMangasPorno extends VerComicsPorno {

    constructor() {
        super();
        super.id = 'vermangasporno';
        super.label = 'VerMangasPorno';
        this.tags = [ 'hentai', 'spanish' ];
        this.url = 'https://vermangasporno.com';
    }
}
*/