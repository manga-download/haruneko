// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TrueColorsScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truecolorsscan', `TrueColorsScan`, 'https://truecolorsscans.miocio.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TrueColorsScan extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'truecolorsscan';
        super.label = 'TrueColorsScan';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://truecolorsscans.miocio.org';
        //this.path        = '/directory/';
        this.language = 'spanish';
    }
}
*/