// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WebNovelLive.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webnovellive', `WebNovel`, 'https://webnovel.live' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WebNovelLive extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'webnovellive';
        super.label = 'WebNovel';
        this.tags = [ 'webtoon', 'novel', 'english' ];
        this.url = 'https://webnovel.live';
    }
}
*/