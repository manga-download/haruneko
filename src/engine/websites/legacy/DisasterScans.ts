// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DisasterScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('disasterscans', `Disaster Scans`, 'https://disasterscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DisasterScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'disasterscans';
        super.label = 'Disaster Scans';
        this.tags = [ 'webtoon', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://disasterscans.com';

        this.queryMangas = 'div.post-title h3 a:last-of-type, div.post-title h5 a:last-of-type';
    }
}
*/