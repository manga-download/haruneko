// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GeceninLordu.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('geceninlordu', `Gecenin Lordu`, 'https://geceninlordu.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GeceninLordu extends WordPressMadara {

    constructor() {
        super();
        super.id = 'geceninlordu';
        super.label = 'Gecenin Lordu';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://geceninlordu.com';
    }
}
*/