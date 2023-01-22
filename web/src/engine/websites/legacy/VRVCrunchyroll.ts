// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './VRVCrunchyroll.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vrv-crunchyroll', `VRV (Crunchyroll)`, 'https://api.vrv.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class VRVCrunchyroll extends VRV {

    /**
     *
     *
    constructor() {
        super();
        // Public members for usage in UI (mandatory)
        super.id = 'vrv-crunchyroll';
        super.label = 'VRV (Crunchyroll)';
        this.tags = [ 'anime', 'subbed', 'multi-lingual' ];
        // Private members for internal usage only (convenience)
        this.subscriptionID = 'crunchyroll';
    }
}
*/