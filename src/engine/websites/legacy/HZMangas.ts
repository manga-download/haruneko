// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HZMangas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hzmangas', `Hz Manga`, 'http://hzmangas.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HZMangas extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hzmangas';
        super.label = 'Hz Manga';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'http://hzmangas.com';
    }
}
*/