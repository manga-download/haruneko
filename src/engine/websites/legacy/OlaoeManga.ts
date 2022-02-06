// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './OlaoeManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('olaoemanga', `مانجا اونلاين (Olaoe Manga)`, 'https://olaoe.giize.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OlaoeManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'olaoemanga';
        super.label = 'مانجا اونلاين (Olaoe Manga)';
        this.tags = [ 'manga', 'arabic' ];
        this.url = 'https://olaoe.giize.com';
    }
}
*/