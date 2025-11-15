// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NovelcoolEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelcool-en', `Novel Cool (EN)`, 'https://www.novelcool.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelcoolEN extends Novelcool {
    constructor() {
        super();
        super.id = 'novelcool-en';
        super.label = 'Novel Cool (EN)';
        this.tags = [ 'english', 'manga', 'webtoon'];
        this.url = 'https://www.novelcool.com';
        this.links = {
            login: 'https://novelcool.com/login.html'
        };
    }
}
*/