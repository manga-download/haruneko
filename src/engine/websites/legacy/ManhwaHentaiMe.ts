// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwaHentaiMe.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwahentaime', `ManhwaHentai.me`, 'https://manhwahentai.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaHentaiMe extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwahentaime';
        super.label = 'ManhwaHentai.me';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://manhwahentai.me';

        this.queryPages = 'div.page-break source';
    }
}
*/