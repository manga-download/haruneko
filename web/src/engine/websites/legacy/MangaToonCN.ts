// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToonCN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoon-cn', `MangaToon (Chinese)`, 'https://mangatoon.mobi/cn' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToonCN extends MangaToon {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangatoon-cn';
        super.label = 'MangaToon (Chinese)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://mangatoon.mobi/cn';
        this.path = '/cn/genre?page=';
    }
}
*/