// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SkyMangas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('skymangas', `Sky Mangas`, 'https://skymangas.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SkyMangas extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'skymangas';
        super.label = 'Sky Mangas';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://skymangas.com';
        this.path = '/manga/list-mode/';
        this.links = {
            login: 'https://skymangas.com/login/'
        };
    }
}
*/