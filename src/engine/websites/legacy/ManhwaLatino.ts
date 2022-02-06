// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwaLatino.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwalatino', `Manhwa-Latino`, 'https://manhwa-latino.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaLatino extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwalatino';
        super.label = 'Manhwa-Latino';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://manhwa-latino.com';
    }
}
*/