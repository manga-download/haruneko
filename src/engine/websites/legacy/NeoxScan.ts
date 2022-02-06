// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NeoxScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('neoxxxscan', `Neoxxx Scanlator`, 'https://xxx.neoxscans.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NeoxScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'neoxxxscan';
        super.label = 'Neoxxx Scanlator';
        this.tags = [ 'hentai', 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://xxx.neoxscans.net';
        this.queryTitleForURI = '.post-title';
    }

    canHandleURI(uri) {
        return /https?:\/\/xxx\.neoxscans\.(com|net)/.test(uri.origin);
    }
}
*/