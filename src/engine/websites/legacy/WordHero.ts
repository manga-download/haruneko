// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WordHero.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wordhero', `WordHero`, 'https://wordhero.my.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WordHero extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'wordhero';
        super.label = 'WordHero';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://wordhero.my.id';
        this.path = '/manga/list-mode/';
    }

}
*/