// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaRoma.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaroma', `Manga Roma`, 'https://mangaroma.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaRoma extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaroma';
        super.label = 'Manga Roma';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangaroma.com';
    }
}
*/