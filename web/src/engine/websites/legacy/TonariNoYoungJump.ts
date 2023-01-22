// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TonariNoYoungJump.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tonarinoyoungjump', `となりのヤングジャンプ (Tonari no Young Jump)`, 'https://tonarinoyj.jp' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TonariNoYoungJump extends CoreView {

    constructor() {
        super();
        super.id = 'tonarinoyoungjump';
        super.label = 'となりのヤングジャンプ (Tonari no Young Jump)';
        this.tags = ['manga', 'japanese'];
        this.url = 'https://tonarinoyj.jp';
        this.path = ['/series', '/series/oneshot', '/series/trial'];

        this.queryManga = 'div.serial-contents ul.series-table-list > li.subpage-table-list-item > a';
        this.queryMangaTitle = 'h4.title';
        this.queryPages = 'p.page-area[data-src]';
    }
}
*/