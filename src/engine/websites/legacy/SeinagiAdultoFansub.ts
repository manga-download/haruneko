// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SeinagiAdultoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('seinagiadultofansub', `SeinagiAdultoFansub`, 'https://adulto.seinagi.org.es' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SeinagiAdultoFansub extends FoolSlide {

    constructor() {
        super();
        super.id = 'seinagiadultofansub';
        super.label = 'SeinagiAdultoFansub';
        this.tags = [ 'hentai', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://adulto.seinagi.org.es';
        this.links = {
            login: 'https://adulto.seinagi.org.es/account/auth/login/'
        };
        //this.path        = '/directory/';
        this.language = 'spanish';
    }
}
*/