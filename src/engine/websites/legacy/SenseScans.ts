// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SenseScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sensescans', `SenseScans`, 'https://sensescans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SenseScans extends FoolSlide {

    constructor() {
        super();
        super.id = 'sensescans';
        super.label = 'SenseScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://sensescans.com';
        this.links = {
            login: 'https://sensescans.com/index.php?action=login2'
        };
        this.path = '/reader/directory/';
        this.language = 'english';
    }
}
*/