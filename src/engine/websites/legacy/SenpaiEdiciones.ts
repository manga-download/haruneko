// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SenpaiEdiciones.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('senpaiediciones', `Senpai Ediciones`, 'https://senpaiediciones.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SenpaiEdiciones extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'senpaiediciones';
        super.label = 'Senpai Ediciones';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://senpaiediciones.com';
        this.path = '/manga/list-mode/';
    }
}
*/