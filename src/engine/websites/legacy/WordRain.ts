// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WordRain.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wordrain', `Wordrain`, 'https://wordrain69.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WordRain extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'wordrain';
        super.label = 'Wordrain';
        this.tags = [ 'novel', 'english' ];
        this.url = 'https://wordrain69.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.ap_container';
    }
}
*/