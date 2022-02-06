// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NightComic.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nightcomic', `NIGHT COMIC`, 'https://www.nightcomic.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NightComic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nightcomic';
        super.label = 'NIGHT COMIC';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.nightcomic.com';
    }
}
*/