// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahentai', `Manga Hentai`, 'https://mangahentai.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaHentai extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangahentai';
        super.label = 'Manga Hentai';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://mangahentai.me';
    }
}
*/