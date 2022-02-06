// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './XXXYaoi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xxxyaoi', `XXXYaoi`, 'https://xxxyaoi.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class XXXYaoi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'xxxyaoi';
        super.label = 'XXXYaoi';
        this.tags = [ 'hentai', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://xxxyaoi.com';
    }
}
*/