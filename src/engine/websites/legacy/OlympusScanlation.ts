// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './OlympusScanlation.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('olympusscanlation', `Olympus Scanlation`, 'https://olympusscanlation.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OlympusScanlation extends WordPressMadara {

    constructor() {
        super();
        super.id = 'olympusscanlation';
        super.label = 'Olympus Scanlation';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://olympusscanlation.com';
    }
}
*/