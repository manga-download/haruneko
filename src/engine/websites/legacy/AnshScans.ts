// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AnshScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anshscans', `AnshScans`, 'https://anshscans.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AnshScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'anshscans';
        super.label = 'AnshScans';
        this.tags = [ 'webtoon', 'english', 'scanlation' ];
        this.url = 'https://anshscans.org';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/