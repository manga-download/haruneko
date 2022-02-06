// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaSpark.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaspark', `مانجا سبارك (MangaSpark)`, 'https://mangaspark.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSpark extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaspark';
        super.label = 'مانجا سبارك (MangaSpark)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangaspark.com';
    }
}
*/