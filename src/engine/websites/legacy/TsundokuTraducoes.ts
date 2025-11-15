// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TsundokuTraducoes.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tsundokutraducoes', `Tsundoku Traduções`, 'https://tsundokutraducoes.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TsundokuTraducoes extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'tsundokutraducoes';
        super.label = 'Tsundoku Traduções';
        this.tags = [ 'webtoon', 'novel', 'portuguese', 'scanlation' ];
        this.url = 'https://tsundokutraducoes.com.br';
        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/