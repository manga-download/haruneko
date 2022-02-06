// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ApolloTeam.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('apolloteam', `The Apollo Team`, 'https://theapollo.team' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ApolloTeam extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'apolloteam';
        super.label = 'The Apollo Team';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://theapollo.team';
        this.path = '/manga/list-mode/';
    }
}
*/