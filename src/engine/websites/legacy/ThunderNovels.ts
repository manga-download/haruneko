// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ThunderNovels.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('thundernovels', `Thunder Novels`, 'https://thundernovels.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ThunderNovels extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'thundernovels';
        super.label = 'Thunder Novels';
        this.tags = [ 'novel', 'portuguese' ];
        this.url = 'https://thundernovels.xyz';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.ap_container';
    }
}
*/