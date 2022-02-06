// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaRockTeam.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarockteam', `Manga Rock Team`, 'https://mangarockteam.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaRockTeam extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangarockteam';
        super.label = 'Manga Rock Team';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangarockteam.com';
    }
}
*/