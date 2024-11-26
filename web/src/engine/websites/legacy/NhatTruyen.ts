// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NhatTruyen.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nhattruyen', `NhatTruyen`, 'https://nhattruyenv.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NhatTruyen extends MojoPortalComic {

    constructor() {
        super();
        super.id = 'nhattruyen';
        super.label = 'NhatTruyen';
        this.tags = [ 'manga', 'vietnamese' ];
        this.url = 'http://nhattruyenvip.com';
        this.links = {
            login: this.url + '/Secure/Login.aspx'
        };
    }
}
*/