// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Helllunatoon.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('helllunatoon', `Helllunatoon`, 'https://hellunatoon.fun' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Helllunatoon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'helllunatoon';
        super.label = 'Helllunatoon';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://hellunatoon.fun';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/