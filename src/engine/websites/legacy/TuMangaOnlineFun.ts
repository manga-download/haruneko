// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TuMangaOnlineFun.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tumangaonlinefun', `TuMangaOnline Fun`, 'http://tumangaonline.fun' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TuMangaOnlineFun extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'tumangaonlinefun';
        super.label = 'TuMangaOnline Fun';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'http://tumangaonline.fun';
        this.links = {
            login: 'http://tusmangasonline.com/admin/login'
        };

        this.language = 'es';
    }
}
*/