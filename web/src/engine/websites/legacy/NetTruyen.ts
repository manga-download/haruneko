// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyen', `NetTruyen`, 'https://nettruyenco.vn' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NetTruyen extends MojoPortalComic {

    constructor() {
        super();
        super.id = 'nettruyen';
        super.label = 'NetTruyen';
        this.tags = [ 'manga', 'webtoon', 'vietnamese' ];
        this.url = 'http://www.nettruyenpro.com';
        this.links = {
            login: this.url + '/Secure/Login.aspx'
        };
    }
}
*/