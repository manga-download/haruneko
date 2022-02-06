// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PrismaScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('prismascans', `Prisma Scan`, 'https://prismascans.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PrismaScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'prismascans';
        super.label = 'Prisma Scan';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://prismascans.net';
    }
}
*/