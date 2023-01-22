// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YugenMangas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yugenmangas', `YugenMangas`, 'https://yugenmangas.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YugenMangas extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'yugenmangas';
        super.label = 'YugenMangas';
        this.tags = [ 'webtoon', 'novel', 'spanish' ];
        this.url = 'https://yugenmangas.com';
        this.queryChapters = 'div.chapter-link > a';
    }
}
*/