// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaLandArabic.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalandarabic', `مانجا لاند عربي (Manga Land Arabic)`, 'https://mangalandarabic.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaLandArabic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangalandarabic';
        super.label = 'مانجا لاند عربي (Manga Land Arabic)';
        this.tags = [ 'webtoon', 'arabic' ];
        this.url = 'https://mangalandarabic.com';
    }
}
*/