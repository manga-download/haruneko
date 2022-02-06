// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Mgkomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mgkomik', `MGKOMIK`, 'https://mgkomik.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mgkomik extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mgkomik';
        super.label = 'MGKOMIK';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://mgkomik.com';
    }
}
*/