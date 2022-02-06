// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LimaScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('limascans', `Lima Scans`, 'http://limascans.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LimaScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'limascans';
        super.label = 'Lima Scans';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'http://limascans.xyz';
        this.path = '/v2';
    }
}
*/