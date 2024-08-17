// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ZinNovel.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zinnovel', `ZinNovel`, 'https://zinnovel.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ZinNovel extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'zinnovel';
        super.label = 'ZinNovel';
        this.tags = [ 'novel', 'english' ];
        this.url = 'https://zinnovel.com';
    }
}
*/