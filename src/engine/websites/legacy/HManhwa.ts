// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HManhwa.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hmanhwa', `HManhwa`, 'https://hmanhwa.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HManhwa extends WordPressMadara {
    constructor() {
        super();
        super.id = 'hmanhwa';
        super.label = 'HManhwa';
        this.tags = [ 'webtoon', 'hentai', 'english', 'korean' ];
        this.url = 'https://hmanhwa.com';
    }
}
*/