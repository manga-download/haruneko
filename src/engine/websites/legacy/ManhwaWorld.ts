// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwaWorld.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaworld', `Manhwa World`, 'https://manhwaworld.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaWorld extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwaworld';
        super.label = 'Manhwa World';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhwaworld.com';
    }
}
*/