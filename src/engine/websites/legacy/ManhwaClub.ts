// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwaClub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaclub', `ManhwaClub`, 'https://manhwa.club' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaClub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwaclub';
        super.label = 'ManhwaClub';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://manhwa.club';
    }
}
*/