// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PhoenixFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('phoenixfansub', `Phoenix Fansub`, 'https://phoenixfansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PhoenixFansub extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'phoenixfansub';
        super.label = 'Phoenix Fansub';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://phoenixfansub.com';
        this.path = '/manga/list-mode/';
    }
}
*/