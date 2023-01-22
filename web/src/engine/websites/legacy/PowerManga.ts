// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PowerManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('powermanga', `PowerManga`, 'http://read.powermanga.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PowerManga extends FoolSlide {

    constructor() {
        super();
        super.id = 'powermanga';
        super.label = 'PowerManga';
        this.tags = [ 'manga', 'high-quality', 'italian', 'scanlation' ];
        this.url = 'http://read.powermanga.org';
        //this.path        = '/directory/';
        this.language = 'italian';
    }
}
*/