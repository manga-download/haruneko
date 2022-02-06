// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AzoraManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('azoramanga', `أزورا مانج (AZORA MANGA)`, 'https://azoramanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AzoraManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'azoramanga';
        super.label = 'أزورا مانج (AZORA MANGA)';
        this.tags = [ 'webtoon', 'arabic' ];
        this.url = 'https://azoramanga.com';
    }
}
*/