// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './InmortalScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('inmortalscan', `Inmortal Scan`, 'https://manga.mundodrama.site' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class InmortalScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'inmortalscan';
        super.label = 'Inmortal Scan';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://manga.mundodrama.site';
    }
}
*/