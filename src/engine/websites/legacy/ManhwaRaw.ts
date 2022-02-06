// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwaRaw.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaraw', `Manhwa Raw`, 'https://manhwaraw.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaRaw extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwaraw';
        super.label = 'Manhwa Raw';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://manhwaraw.com';
    }
}
*/