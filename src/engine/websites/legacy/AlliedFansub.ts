// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AlliedFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('alliedfansub', `Allied Fansub`, 'https://alliedfansub.online' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AlliedFansub extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'alliedfansub';
        super.label = 'Allied Fansub';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://alliedfansub.online';
        this.path = '/manga/list-mode/';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/