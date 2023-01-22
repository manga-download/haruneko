// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TruyenChon.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyenchon', `TruyenChon`, 'http://truyenchon.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TruyenChon extends MojoPortalComic {

    constructor() {
        super();
        super.id = 'truyenchon';
        super.label = 'TruyenChon';
        this.tags = [ 'manga', 'webtoon', 'vietnamese' ];
        this.url = 'http://truyenchon.com';
        this.links = {
            login: 'https://truyenchon.com/Secure/Login.aspx'
        };
    }
}
*/