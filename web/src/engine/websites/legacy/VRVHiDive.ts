// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './VRVHiDive.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vrv-hidive', `VRV (HiDive)`, 'https://api.vrv.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class VRVHiDive extends VRV {

    /**
     *
     *
    constructor() {
        super();
        // Public members for usage in UI (mandatory)
        super.id = 'vrv-hidive';
        super.label = 'VRV (HiDive)';
        this.tags = [ 'anime', 'dubbed', 'english' ];
        // Private members for internal usage only (convenience)
        this.subscriptionID = 'hidive';
    }
}
*/