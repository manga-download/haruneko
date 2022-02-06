// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomikTapMDO.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiktap-mdo', `KomikTap (MDO)`, 'https://manhwa.komiktap.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikTapMDO extends WordPressMadara {

    constructor() {
        super();
        super.id = 'komiktap-mdo';
        super.label = 'KomikTap (MDO)';
        this.tags = [ 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://manhwa.komiktap.co';

        this.queryTitleForURI = 'div.post-title h1';
    }
}
*/