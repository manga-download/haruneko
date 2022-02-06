// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ZeroScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zeroscans', `ZeroScans`, 'https://zeroscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ZeroScans extends Genkan {

    constructor() {
        super();
        super.id = 'zeroscans';
        super.label = 'ZeroScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://zeroscans.com';
        this.links = {
            login: 'https://zeroscans.com/login'
        };
    }
}
*/