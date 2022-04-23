// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TonizuToon.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tonizutoon', `Tonizu Toon`, 'https://tonizutoon.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TonizuToon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tonizutoon';
        super.label = 'Tonizu Toon';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://tonizutoon.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/