// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaReceh.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangareceh', `MANGCEH`, 'https://mangceh.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaReceh extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangareceh';
        super.label = 'MANGCEH';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://mangceh.me';

        this.queryChapters = 'li.wp-manga-chapter > a:first-of-type';
    }
}
*/