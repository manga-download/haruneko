// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BacaMangaOrg.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacamangaorg', `BacaMangaOrg`, 'https://bacamanga.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BacaMangaOrg extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'bacamangaorg';
        super.label = 'BacaMangaOrg';
        this.tags = ['manga', 'webtoon', 'indonesian'];
        this.url = 'https://bacamanga.org';
        this.path = '/manga/?list';
    }
}
*/