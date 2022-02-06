// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SkyManhwa.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('skymanhwa', `Skymanhwa`, 'https://skymanhwa.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SkyManhwa extends WordPressMadara {

    constructor() {
        super();
        super.id = 'skymanhwa';
        super.label = 'Skymanhwa';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://skymanhwa.com';
    }
}
*/