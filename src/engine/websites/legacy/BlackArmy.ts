// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BlackArmy.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('blackarmy', `Black Army`, 'https://blackarmy.fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BlackArmy extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'blackarmy';
        super.label = 'Black Army';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://blackarmy.fr';
        this.path = '/manga/list-mode/';
    }
}
*/