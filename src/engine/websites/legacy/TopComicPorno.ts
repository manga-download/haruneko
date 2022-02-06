// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TopComicPorno.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('topcomicporno', `Top Comic Porno`, 'https://topcomicporno.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TopComicPorno extends WordPressMadara {

    constructor() {
        super();
        super.id = 'topcomicporno';
        super.label = 'Top Comic Porno';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://topcomicporno.com';
    }
}
*/