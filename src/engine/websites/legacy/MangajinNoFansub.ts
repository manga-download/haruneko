// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangajinNoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangajinnofansub', `MangajinNoFansub`, 'https://www.mangajinnofansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangajinNoFansub extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangajinnofansub';
        super.label = 'MangajinNoFansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://www.mangajinnofansub.com';
        this.path = '/lector/directory/';
        this.language = 'spanish';
    }
}
*/