// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KKJScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kkjscans', `KKJ Scans`, 'https://kkjscans.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KKJScans extends Genkan {

    constructor() {
        super();
        super.id = 'kkjscans';
        super.label = 'KKJ Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://kkjscans.co';
    }
}
*/