// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GloryScansHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gloryscanshentai', `Glory Scans Hentai`, 'https://hentai.gloryscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GloryScansHentai extends WordPressMadara {

    constructor() {
        super();
        super.id = 'gloryscanshentai';
        super.label = 'Glory Scans Hentai';
        this.tags = [ 'hentai', 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://hentai.gloryscan.com';
    }
}
*/