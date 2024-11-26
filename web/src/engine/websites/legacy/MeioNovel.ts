// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MeioNovel.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('meionovel', `Meio Novel`, 'https://meionovels.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MeioNovel extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'meionovel';
        super.label = 'Meio Novel';
        this.tags = [ 'manga', 'webtoon', 'novel', 'indonesian' ];
        this.url = 'https://meionovel.id';
    }
}
*/