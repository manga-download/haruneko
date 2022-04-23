// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AsuraScansTR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asurascans-tr', `Asura Scans (TR)`, 'https://asurascanstr.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AsuraScansTR extends AsuraScans {

    constructor() {
        super();
        super.id = 'asurascans-tr';
        super.label = 'Asura Scans (TR)';
        this.tags = ['webtoon', 'turkish'];
        this.url = 'https://asurascanstr.com';
    }

    get icon() {
        return '/img/connectors/asurascans';
    }
}
*/