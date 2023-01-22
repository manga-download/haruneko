// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HoshikuzuuScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hoshikuzuuscans', `HoshikuzuuScans`, 'http://hoshiscans.shounen-ai.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HoshikuzuuScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'hoshikuzuuscans';
        super.label = 'HoshikuzuuScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://hoshiscans.shounen-ai.net';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/