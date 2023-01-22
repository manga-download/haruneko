// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ArtemisNoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('artemisnofansub', `Artemis No Fansub`, 'https://artemisnf.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ArtemisNoFansub extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'artemisnofansub';
        super.label = 'Artemis No Fansub';
        this.tags = [ 'webtoon', 'novel', 'spanish', 'scanlation' ];
        this.url = 'https://artemisnf.com';

        this.novelContentQuery = 'div.reading-content div[class^="text-"';
    }
}
*/