// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToroVI.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoro-vi', `MangaToro (VI)`, 'https://vi.mangatoro.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToroVI extends MojoPortalComic {

    constructor() {
        super();
        super.id = 'mangatoro-vi';
        super.label = 'MangaToro (VI)';
        this.tags = [ 'manga', 'webtoon', 'vietnamese' ];
        this.url = 'https://vi.mangatoro.com';
        this.links = {
            login: this.url + '/Secure/Login.aspx'
        };
    }
}
*/