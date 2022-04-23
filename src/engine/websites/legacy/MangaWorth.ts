// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaWorth.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaworth', `Manga Worth`, 'https://mangaworth.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaWorth extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaworth';
        super.label = 'Manga Worth';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://mangaworth.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/