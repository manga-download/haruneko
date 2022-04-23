// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NiveraFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('niverafansub', `Nivera Fansub`, 'https://niverafansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NiveraFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'niverafansub';
        super.label = 'Nivera Fansub';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://niverafansub.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/