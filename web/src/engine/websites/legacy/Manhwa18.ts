// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Manhwa18.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwa18', `Manhwa 18 (.com)`, 'https://manhwa18.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manhwa18 extends FlatManga {

    constructor() {
        super();
        super.id = 'manhwa18';
        super.label = 'Manhwa 18 (.com)';
        this.tags = [ 'hentai', 'multi-lingual' ];
        this.url = 'https://manhwa18.com';
        this.requestOptions.headers.set('x-referer', this.url);

        this.language = 'en';
    }
}
*/