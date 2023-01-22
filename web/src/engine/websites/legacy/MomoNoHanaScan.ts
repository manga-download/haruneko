// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MomoNoHanaScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('momonohanascan', `Momo no Hana Scan`, 'https://momonohanascan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MomoNoHanaScan extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'momonohanascan';
        super.label = 'Momo no Hana Scan';
        this.tags = [ 'manga', 'webtoon', 'novel', 'portuguese' ];
        this.url = 'https://momonohanascan.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/