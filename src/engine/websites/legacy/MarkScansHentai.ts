// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MarkScansHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('markscanshentai', `Mark Scans Hentai`, 'https://mhentais.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MarkScansHentai extends WordPressMadara {

    constructor() {
        super();
        super.id = 'markscanshentai';
        super.label = 'Mark Scans Hentai';
        this.tags = [ 'webtoon', 'portuguese', 'hentai' ];
        this.url = 'https://mhentais.com';
    }
}
*/