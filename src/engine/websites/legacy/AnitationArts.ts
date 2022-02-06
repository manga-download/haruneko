// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AnitationArts.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anitationarts', `Anitation Arts`, 'https://anitationarts.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AnitationArts extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'anitationarts';
        super.label = 'Anitation Arts';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://anitationarts.org';
        this.path = '/manga/?list';
    }
}
*/