// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WhiteCloudPavilion.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('whitecloudpavilion', `White Cloud Pavilion`, 'https://www.whitecloudpavilion.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WhiteCloudPavilion extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'whitecloudpavilion';
        super.label = 'White Cloud Pavilion';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://www.whitecloudpavilion.com';
        this.path = '/manga/patreon/';

        this.language = 'en';
    }
}
*/