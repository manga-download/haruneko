// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Katakomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('katakomik', `Katakomik`, 'https://www.katakomik.my.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Katakomik extends WordPressMangastream {
    constructor() {
        super();
        super.id = 'katakomik';
        super.label = 'Katakomik';
        this.tags = ['webtoon', 'indonesian'];
        this.url = 'https://www.katakomik.my.id';

        this.queryMangas = 'div.bsx a';
        this.queryChapters = 'div.eph-num a';
        this.queryChaptersTitle = 'span.chapternum';
        this.queryPages = 'img.ts-main-image.curdown';
    }
}
*/