// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MoonLoversScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('moonloversscan', `Moon Lovers Scan`, 'https://moonloversscan.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MoonLoversScan extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'moonloversscan';
        super.label = 'Moon Lovers Scan';
        this.tags = [ 'webtoon', 'novel', 'portuguese' ];
        this.url = 'https://moonloversscan.com.br';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/