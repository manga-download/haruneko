// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FudidoScanlator.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fudidoscanlator', `Fudido Scanlator`, 'https://fudidoscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FudidoScanlator extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'fudidoscanlator';
        super.label = 'Fudido Scanlator';
        this.tags = [ 'manga', 'webtoon', 'novel', 'portuguese' ];
        this.url = 'https://fudidoscan.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/