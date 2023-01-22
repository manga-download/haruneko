// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PsychoPlay.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('psychoplay', `PsychoPlay`, 'https://psychoplay.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PsychoPlay extends Genkan {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'psychoplay';
        super.label = 'PsychoPlay';
        this.tags = [ 'manga', 'english', 'high-quality', 'scanlation' ];
        this.url = 'https://psychoplay.co';
    }
}
*/