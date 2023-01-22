// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaScouts.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangascouts', `MangaScouts`, 'http://onlinereader.mangascouts.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaScouts extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangascouts';
        super.label = 'MangaScouts';
        this.tags = [ 'manga', 'high-quality', 'german', 'scanlation' ];
        this.url = 'http://onlinereader.mangascouts.org';
        this.path = '/directory/';
        this.language = 'german';
    }
}
*/