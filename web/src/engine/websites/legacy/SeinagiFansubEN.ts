// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SeinagiFansubEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('seinagifansub-en', `SeinagiFansub (EN)`, 'https://seinagi.org.es' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SeinagiFansubEN extends FoolSlide {

    constructor() {
        super();
        super.id = 'seinagifansub-en';
        super.label = 'SeinagiFansub (EN)';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://seinagi.org.es';
        this.links = {
            login: 'https://seinagi.org.es/forum/index.php?action=login'
        };
        this.path = '/reader/directory/';
        this.language = 'english';
    }
}
*/