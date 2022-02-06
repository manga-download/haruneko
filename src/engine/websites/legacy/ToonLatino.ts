// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToonLatino.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonlatino', `Toon Latino`, 'https://toonlatinoapp.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToonLatino extends WordPressMadara {

    constructor() {
        super();
        super.id = 'toonlatino';
        super.label = 'Toon Latino';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://toonlatinoapp.com';
        this.requestOptions.headers.set('x-cookie', 'pll_language=es');
    }
}
*/