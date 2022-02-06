// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MataKomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('matakomik', `Matakomik`, 'https://matakomik.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MataKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'matakomik';
        super.label = 'Matakomik';
        this.tags = [ 'webtoon', 'manga', 'indonesian' ];
        this.url = 'https://matakomik.com';
        this.path = '/manga/?list';

        this.queryChapters = 'div.bxcl ul li span.lchx a';
        this.queryChaptersTitle = undefined;
    }
}
*/