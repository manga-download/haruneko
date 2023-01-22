// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './VRVRoosterteeth.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vrv-roosterteeth', `VRV (Rooster Teeth)`, 'https://api.vrv.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class VRVRoosterteeth extends VRV {

    /**
     *
     *
    constructor() {
        super();
        // Public members for usage in UI (mandatory)
        super.id = 'vrv-roosterteeth';
        super.label = 'VRV (Rooster Teeth)';
        this.tags = [ 'webshow', 'animation', 'english' ];
        // Private members for internal usage only (convenience)
        this.subscriptionID = 'roosterteeth';
    }
}
*/