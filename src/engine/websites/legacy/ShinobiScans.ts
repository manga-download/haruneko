// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShinobiScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shinobiscans', `ShinobiScans`, 'https://shinobiscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShinobiScans extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'shinobiscans';
        super.label = 'ShinobiScans';
        this.tags = [ 'webtoon', 'novel', 'italian', 'scanlation' ];
        this.url = 'https://shinobiscans.com';

        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/