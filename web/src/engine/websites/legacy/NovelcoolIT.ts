// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NovelcoolIT.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelcool-it', `Novel Cool (IT)`, 'https://it.novelcool.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelcoolIT extends Novelcool {
    constructor() {
        super();
        super.id = 'novelcool-it';
        super.label = 'Novel Cool (IT)';
        this.tags = [ 'italian', 'manga', 'webtoon'];
        this.url = 'https://it.novelcool.com';
        this.links = {
            login: 'https://it.novelcool.com/login.html'
        };
    }
}
*/