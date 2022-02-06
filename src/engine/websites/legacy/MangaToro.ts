// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToro.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoro', `MangaToro`, 'https://www.mangatoro.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToro extends MojoPortalComic {

    constructor() {
        super();
        super.id = 'mangatoro';
        super.label = 'MangaToro';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://www.mangatoro.com';
        this.links = {
            login: this.url + '/Secure/Login.aspx'
        };
    }
}
*/