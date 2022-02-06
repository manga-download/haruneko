// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaNeloLink.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganelolink', `Manga Nelo Link`, 'https://manganelo.link' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaNeloLink extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manganelolink';
        super.label = 'Manga Nelo Link';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://manganelo.link';
    }
}
*/