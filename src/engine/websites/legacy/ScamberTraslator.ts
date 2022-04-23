// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ScamberTraslator.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scambertraslator', `ScamberTraslator`, 'https://scambertraslator.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ScamberTraslator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'scambertraslator';
        super.label = 'ScamberTraslator';
        this.tags = [ 'webtoon', 'spanish', 'scanlation' ];
        this.url = 'https://scambertraslator.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/