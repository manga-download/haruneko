// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NovelcoolES.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelcool-es', `Novel Cool (ES)`, 'https://es.novelcool.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelcoolES extends Novelcool {
    constructor() {
        super();
        super.id = 'novelcool-es';
        super.label = 'Novel Cool (ES)';
        this.tags = [ 'spanish', 'manga', 'webtoon'];
        this.url = 'https://es.novelcool.com';
        this.links = {
            login: 'https://es.novelcool.com/login.html'
        };
    }
}
*/