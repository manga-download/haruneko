// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AngelOfResistance.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('angelofresistance', `Angel Of Resistance (AOR-TR)`, 'https://angelofresistance-tr.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AngelOfResistance extends WordPressMadara {

    constructor() {
        super();
        super.id = 'angelofresistance';
        super.label = 'Angel Of Resistance (AOR-TR)';
        this.tags = [ 'manga', 'webtoon', 'turkish'];
        this.url = 'https://angelofresistance-tr.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/