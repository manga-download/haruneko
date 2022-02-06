// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomikSave.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiksave', `Komik Save`, 'https://komiksave.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikSave extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komiksave';
        super.label = 'Komik Save';
        this.tags = [ 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://komiksave.me';
        this.path = '/komik/list-mode/';
    }
}
*/