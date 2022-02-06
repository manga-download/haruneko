// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FreeManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('freemanga', `Free Manga`, 'https://freemanga.me/' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FreeManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'freemanga';
        super.label = 'Free Manga';
        this.tags = ['webtoon', 'english', 'manga'];
        this.url = 'https://freemanga.me/';
    }
}
*/