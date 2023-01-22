// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToonID.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoon-id', `MangaToon (Indonesian)`, 'https://mangatoon.mobi/id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToonID extends MangaToon {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangatoon-id';
        super.label = 'MangaToon (Indonesian)';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://mangatoon.mobi/id';
        this.path = '/id/genre?page=';
    }
}
*/