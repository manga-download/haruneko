// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YaoiIsLife.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoiislife', `YaoiIsLife`, 'http://yaoislife.shounen-ai.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YaoiIsLife extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'yaoiislife';
        super.label = 'YaoiIsLife';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://yaoislife.shounen-ai.net';
        this.path = '/reader/directory/';
        this.language = 'english';
    }
}
*/