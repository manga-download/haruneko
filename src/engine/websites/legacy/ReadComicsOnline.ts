// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReadComicsOnline.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readcomicsonline', `Read Comics Online`, 'https://readcomicsonline.ru' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadComicsOnline extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'readcomicsonline';
        super.label = 'Read Comics Online';
        this.tags = [ 'comic', 'english' ];
        this.url = 'https://readcomicsonline.ru';
        this.links = {
            login: 'https://readcomicsonline.ru/auth/login'
        };

        this.language = 'en';
    }
}
*/