// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TheTopComic.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('thetopcomic', `The Top Comic`, 'https://thetopcomic.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TheTopComic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'thetopcomic';
        super.label = 'The Top Comic';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://thetopcomic.com';
    }
}
*/