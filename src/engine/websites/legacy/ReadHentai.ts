// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReadHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readhentai', `Read Hentai`, 'https://readhent.ai' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadHentai extends HentaiShark {

    constructor() {
        super();
        super.id = 'readhentai';
        super.label = 'Read Hentai';
        this.tags = ['hentai', 'multi-lingual'];
        this.url = 'https://readhent.ai';
        this.links = {
            login: 'https://readhent.ai/auth/login'
        };
    }
}
*/