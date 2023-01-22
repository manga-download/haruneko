// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToroJA.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoro-ja', `MangaToro (JA)`, 'https://ja.mangatoro.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToroJA extends MojoPortalComic {

    constructor() {
        super();
        super.id = 'mangatoro-ja';
        super.label = 'MangaToro (JA)';
        this.tags = [ 'manga', 'webtoon', 'japanese' ];
        this.url = 'https://ja.mangatoro.com';
        this.links = {
            login: this.url + '/Secure/Login.aspx'
        };
    }
}
*/