// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToonEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoon-pt', `MangaToon (Portuguese)`, 'https://mangatoon.mobi/pt' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToonEN extends MangaToon {

    constructor() {
        super();
        super.id = 'mangatoon-pt';
        super.label = 'MangaToon (Portuguese)';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://mangatoon.mobi/pt';
        this.path = '/pt/genre?page=';
    }
}
*/