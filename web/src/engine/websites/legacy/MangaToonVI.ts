// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToonVI.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoon-vi', `MangaToon (Vietnamese)`, 'https://mangatooncom.vn/vi' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToonVI extends MangaToon {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangatoon-vi';
        super.label = 'MangaToon (Vietnamese)';
        this.tags = [ 'webtoon', 'vietnamese' ];
        this.url = 'https://mangatoon.mobi/vi';
        this.path = '/vi/genre?page=';
    }
}
*/