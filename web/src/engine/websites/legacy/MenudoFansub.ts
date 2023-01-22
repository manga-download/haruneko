// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MenudoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('menudofansub', `MenudoFansub`, 'http://www.menudo-fansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MenudoFansub extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'menudofansub';
        super.label = 'MenudoFansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'http://www.menudo-fansub.com';
        this.path = '/slide/directory/';
        this.language = 'spanish';
    }
}
*/