// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './JokerFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jokerfansub', `JokerFansub`, 'https://reader.jkrfb.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class JokerFansub extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'jokerfansub';
        super.label = 'JokerFansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://reader.jkrfb.xyz';
        //this.path        = '/directory/';
        this.language = 'spanish';
    }
}
*/