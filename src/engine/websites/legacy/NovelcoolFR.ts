// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NovelcoolFR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelcool-fr', `Novel Cool (FR)`, 'https://fr.novelcool.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelcoolFR extends Novelcool {
    constructor() {
        super();
        super.id = 'novelcool-fr';
        super.label = 'Novel Cool (FR)';
        this.tags = [ 'french', 'manga', 'webtoon'];
        this.url = 'https://fr.novelcool.com';
        this.links = {
            login: 'https://fr.novelcool.com/login.html'
        };
    }
}
*/