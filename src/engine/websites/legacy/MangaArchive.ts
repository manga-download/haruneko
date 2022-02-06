// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaArchive.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaarchive', `مانجا عرب اون لاين (Manga Archive)`, 'https://mangaarabonline.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaArchive extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaarchive';
        super.label = 'مانجا عرب اون لاين (Manga Archive)';
        this.tags = [ 'webtoon', 'arabic' ];
        this.url = 'https://mangaarabonline.com';
    }
}
*/