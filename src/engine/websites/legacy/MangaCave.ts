// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaCave.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacave', `Manga Cave`, 'https://mangacave.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaCave extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangacave';
        super.label = 'Manga Cave';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://mangacave.com';
    }
}
*/