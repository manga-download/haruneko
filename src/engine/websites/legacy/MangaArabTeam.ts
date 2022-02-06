// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaArabTeam.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaarabteam', `مانجا عرب تيم (Manga Arab Team)`, 'https://mangaarabteam.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaArabTeam extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaarabteam';
        super.label = 'مانجا عرب تيم (Manga Arab Team)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangaarabteam.com';
    }
}
*/