// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AHStudios.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ahstudios', `A.H Studio`, 'https://ahstudios.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AHStudios extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ahstudios';
        super.label = 'A.H Studio';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://ahstudios.net';
    }
}
*/