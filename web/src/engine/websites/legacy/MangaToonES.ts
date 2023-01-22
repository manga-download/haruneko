// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToonES.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoon-es', `MangaToon (Spanish)`, 'https://mangatoon.mobi/es' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToonES extends MangaToon {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangatoon-es';
        super.label = 'MangaToon (Spanish)';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://mangatoon.mobi/es';
        this.path = '/es/genre?page=';
    }
}
*/