// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SolitarioNoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('solitarionofansub', `SolitarioNoFansub`, 'http://snf.mangaea.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SolitarioNoFansub extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'solitarionofansub';
        super.label = 'SolitarioNoFansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'http://snf.mangaea.net';
        this.path = '/slide/directory/';
        this.language = 'spanish';
    }
}
*/