// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './StickHorse.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('stickhorse', `Stick Horse`, 'https://www.stickhorse.cl' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class StickHorse extends WordPressMadara {

    constructor() {
        super();
        super.id = 'stickhorse';
        super.label = 'Stick Horse';
        this.tags = [ 'manga', 'webtoon', 'comic', 'spanish' ];
        this.url = 'https://www.stickhorse.cl';
    }
}
*/