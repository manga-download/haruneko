// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaNeloTeam.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganeloteam', `Manga Nelo Team`, 'https://manganeloteam.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaNeloTeam extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manganeloteam';
        super.label = 'Manga Nelo Team';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manganeloteam.com';
    }
}
*/