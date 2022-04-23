// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Rio2Manga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rio2manga', `Rio2Manga`, 'https://rio2manga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Rio2Manga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'rio2manga';
        super.label = 'Rio2Manga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://rio2manga.com';
    }
}
*/