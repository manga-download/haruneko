// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MartialScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('martialscans', `Martial Scans`, 'https://martialscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MartialScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'martialscans';
        super.label = 'Martial Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://martialscans.com';

        this.queryMangas = 'div.post-title h3 a:not([target]), div.post-title h5 a:not([target])';
    }
}
*/