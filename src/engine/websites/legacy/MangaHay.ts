// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaHay.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahay', `Bulu Manga`, 'https://ww3.bulumanga.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaHay extends WordPressZbulu {

    constructor() {
        super();
        super.id = 'mangahay';
        super.label = 'Bulu Manga';
        this.tags = [ 'manga', 'webtoon', 'vietnamese' ];
        this.url = 'https://ww3.bulumanga.net';
    }
}
*/