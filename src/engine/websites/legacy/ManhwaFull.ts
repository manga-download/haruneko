// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwaFull.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwafull', `ManhwaFull`, 'https://manhwafull.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaFull extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwafull';
        super.label = 'ManhwaFull';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhwafull.com';
    }
}
*/