// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LilyManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lilymanga', `Lily Manga`, 'https://lilymanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LilyManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'lilymanga';
        super.label = 'Lily Manga';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://lilymanga.com';
    }
}
*/