// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManHuaFen.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuafen', `漫画呗 (ManHuaFen)`, 'https://www.manhuafen.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManHuaFen extends SinMH {

    constructor() {
        super();
        super.id = 'manhuafen';
        super.label = '漫画呗 (ManHuaFen)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://www.manhuafen.com';

        this.queryManga = 'div.wrap_intro_l div.wrap_intro_l_comic div.comic_deCon h1';
        this.queryMangasPageCount = 'div.list_head_mid ul.pagination li.last a';
        this.queryMangas = 'ul.list_con_li li span.comic_list_det h3 a';
        this.queryChapters = 'div.zj_list_con ul li a';
    }
}
*/