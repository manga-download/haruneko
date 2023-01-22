// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NovelcoolDE.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelcool-de', `Novel Cool (DE)`, 'https://de.novelcool.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelcoolDE extends Novelcool {
    constructor() {
        super();
        super.id = 'novelcool-de';
        super.label = 'Novel Cool (DE)';
        this.tags = [ 'german', 'manga', 'webtoon'];
        this.url = 'https://de.novelcool.com';
        this.links = {
            login: 'https://de.novelcool.com/login.html'
        };
    }
}
*/