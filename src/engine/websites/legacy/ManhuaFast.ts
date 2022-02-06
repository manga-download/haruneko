// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhuaFast.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuafast', `Manhuafast`, 'https://manhuafast.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhuaFast extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuafast';
        super.label = 'Manhuafast';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhuafast.com';

        this.queryPages = 'figure source, div.page-break source';
    }
}
*/