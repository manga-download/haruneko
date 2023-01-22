// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MethodScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('methodscans', `Method Scans`, 'https://methodscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MethodScans extends Genkan {

    constructor() {
        super();
        super.id = 'methodscans';
        super.label = 'Method Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://methodscans.com';
    }
}
*/