// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FenixScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fenixscan', `Manga Fenix`, 'https://manga-fenix.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FenixScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'fenixscan';
        super.label = 'Manga Fenix';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://manga-fenix.com';
    }
}
*/