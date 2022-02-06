// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ModeScanlator.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('modescanlator', `Mode Scanlator`, 'https://modescanlator.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ModeScanlator extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'modescanlator';
        super.label = 'Mode Scanlator';
        this.tags = [ 'webtoon', 'novel', 'portuguese' ];
        this.url = 'https://modescanlator.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/