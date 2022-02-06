// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NoxSubs.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('noxsubs', `Nox Subs`, 'https://noxsubs.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NoxSubs extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'noxsubs';
        super.label = 'Nox Subs';
        this.tags = [ 'webtoon', 'manga', 'turkish' ];
        this.url = 'https://noxsubs.com';
        this.path = '/manga/list-mode/';
    }
}
*/