// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaEclipse.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaeclipse', `Manga Eclipse`, 'https://mangaeclipse.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaEclipse extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaeclipse';
        super.label = 'Manga Eclipse';
        this.tags = ['webtoon', 'english'];
        this.url = 'https://mangaeclipse.com';

        this.requestOptions.headers.set('x-referer', this.url);
    }

}
*/