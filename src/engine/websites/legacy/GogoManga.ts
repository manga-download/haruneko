// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GogoManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gogomanga', `Gogomanga`, 'https://gogomanga.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GogoManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'gogomanga';
        super.label = 'Gogomanga';
        this.tags = ['webtoon', 'english', 'manga'];
        this.url = 'https://gogomanga.org';
        this.path = '/manga/list-mode/';
    }
}
*/