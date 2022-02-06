// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReadHentaiManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readhentaimanga', `ReadHentaiManga`, 'http://readhentaimanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadHentaiManga extends WordPressLightPro {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'readhentaimanga';
        super.label = 'ReadHentaiManga';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'http://readhentaimanga.com';
        this.path = '/hentai-manga-list/all/any/name-az/';

        this.queryMangas = 'div.mng_lst ul.lst div ul li div#center > a';
    }
}
*/