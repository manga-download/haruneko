// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SixParkbbsWeb.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sixparkbbsweb', `6parkbbs (新❀华漫)`, 'https://web.6parkbbs.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SixParkbbsWeb extends SixParkbbs {

    constructor() {
        super();
        super.id = 'sixparkbbsweb';
        super.label = '6parkbbs (新❀华漫)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://web.6parkbbs.com';

        this.path = '/index.php?app=forum&act=bbs&bbsid=2032&p=%PAGE%';
        this.pathMatch = /p=(\d+)/;
        this.queryMangaTitle = 'div.c-box p.c-box-h b';
        this.queryMangas = 'div#d_list div.repl-list-one a:nth-child(1)';
        this.queryMangasMatch = /.*\[漫画\]/;
        this.queryPage = 'div.cen-main div.c-box-m center source';
    }
}
*/