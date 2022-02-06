// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Japanime.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('japanime', `Japanime`, 'https://japanime.ch' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Japanime extends WordPressMadara {

    constructor() {
        super();
        super.id = 'japanime';
        super.label = 'Japanime';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://japanime.ch';
    }
}
*/