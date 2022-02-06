// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SisiGelap.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sisigelap', `SISI GELAP`, 'https://sisigelap.club' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SisiGelap extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sisigelap';
        super.label = 'SISI GELAP';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://sisigelap.club';
    }
}
*/