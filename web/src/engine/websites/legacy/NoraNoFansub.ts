// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NoraNoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('noranofansub', `NoraNoFansub`, 'https://www.noranofansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NoraNoFansub extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'noranofansub';
        super.label = 'NoraNoFansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://www.noranofansub.com';
        this.path = '/lector/directory/';
        this.language = 'spanish';
    }
}
*/