// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YamiTenshiNoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yamitenshinofansub', `YamiTenshiNoFansub`, 'http://lector.ytnofan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YamiTenshiNoFansub extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'yamitenshinofansub';
        super.label = 'YamiTenshiNoFansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'http://lector.ytnofan.com';
        //this.path        = '/directory/';
        this.language = 'spanish';
    }
}
*/