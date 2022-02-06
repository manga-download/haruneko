// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BlackDragonsFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bdsfansub', `Black Dragons no Fansub`, 'https://bdsfansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BlackDragonsFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'bdsfansub';
        super.label = 'Black Dragons no Fansub';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://bdsfansub.com';
    }
}
*/