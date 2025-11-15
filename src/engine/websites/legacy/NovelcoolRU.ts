// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NovelcoolRU.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelcool-ru', `Novel Cool (RU)`, 'https://ru.novelcool.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelcoolRU extends Novelcool {
    constructor() {
        super();
        super.id = 'novelcool-ru';
        super.label = 'Novel Cool (RU)';
        this.tags = [ 'russian', 'manga', 'webtoon'];
        this.url = 'https://ru.novelcool.com';
        this.links = {
            login: 'https://ru.novelcool.com/login.html'
        };
    }
}
*/