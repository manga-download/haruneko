// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KangaryuTeam.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kangaryuteam', `Kangaryu Team`, 'https://kangaryu-team.fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KangaryuTeam extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'kangaryuteam';
        super.label = 'Kangaryu Team';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://kangaryu-team.fr';

        this.language = 'fr';
    }
}
*/