// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ForgottenScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('forgottenscans', `ForgottenScans`, 'http://reader.fos-scans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ForgottenScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'forgottenscans';
        super.label = 'ForgottenScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://reader.fos-scans.com';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/