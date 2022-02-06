// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TiempoDeWebeo.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tiempodewebeo', `Tiempo de Webeo`, 'https://tiempodewebeo.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TiempoDeWebeo extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tiempodewebeo';
        super.label = 'Tiempo de Webeo';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://tiempodewebeo.com';
    }
}
*/