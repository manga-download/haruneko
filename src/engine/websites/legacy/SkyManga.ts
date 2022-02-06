// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SkyManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('skymanga', `Sky Manga`, 'https://skymanga.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SkyManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'skymanga';
        super.label = 'Sky Manga';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://skymanga.co';
    }
}
*/