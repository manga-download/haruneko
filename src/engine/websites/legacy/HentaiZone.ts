// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HentaiZone.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaizone', `HentaiZone`, 'https://hentaizone.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HentaiZone extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hentaizone';
        super.label = 'HentaiZone';
        this.tags = [ 'webtoon', 'hentai', 'french' ];
        this.url = 'https://hentaizone.xyz';
    }
}
*/