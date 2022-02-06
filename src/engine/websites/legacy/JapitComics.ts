// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './JapitComics.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('japitcomics', `Japit Comics`, 'https://j-comics.ru' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class JapitComics extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'japitcomics';
        super.label = 'Japit Comics';
        this.tags = [ 'manga', 'russian' ];
        this.url = 'https://j-comics.ru';

        this.language = 'ru';
    }
}
*/