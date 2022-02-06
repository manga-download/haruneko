// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AllPornComic.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('allporncomic', `AllPornComic`, 'https://allporncomic.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AllPornComic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'allporncomic';
        super.label = 'AllPornComic';
        this.tags = [ 'hentai', 'porn', 'english' ];
        this.url = 'https://allporncomic.com';
    }
}
*/