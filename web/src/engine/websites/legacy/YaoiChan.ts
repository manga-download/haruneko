// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YaoiChan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoichan', `Яой-тян (Yaoi-chan)`, 'http://yaoi-chan.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YaoiChan extends MangaChan {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'yaoichan';
        super.label = 'Яой-тян (Yaoi-chan)';
        this.tags = [ 'hentai', 'russian' ];
        this.url = 'http://yaoi-chan.me';

        this.queryChapters = 'table.table_cha tr td div.manga a';
    }
}
*/