// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ImperfectComic.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imperfectcomic', `Imperfect Comic`, 'https://imperfectcomic.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImperfectComic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'imperfectcomic';
        super.label = 'Imperfect Comic';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://imperfectcomic.com';
    }
}
*/