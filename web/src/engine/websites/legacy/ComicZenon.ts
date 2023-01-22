// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicZenon.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comiczenon', `ゼノン編集部 (Comic Zenon)`, 'https://comic-zenon.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicZenon extends CoreView {

    constructor() {
        super();
        super.id = 'comiczenon';
        super.label = 'ゼノン編集部 (Comic Zenon)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://comic-zenon.com';

        this.path = [ '/series/zenon', '/series/zenyon', '/series/tatan', '/series/oneshot' ];
        this.queryManga = 'div.serial-contents section div.series-item h4 > a';
        this.queryMangaTitle = undefined;

    }
}
*/