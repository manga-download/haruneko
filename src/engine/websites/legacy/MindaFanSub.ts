// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MindaFanSub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mindafansub', `Minda Fansub`, 'https://mindafansub.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MindaFanSub extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mindafansub';
        super.label = 'Minda Fansub';
        this.tags = ['webtoon', 'turkish', 'scanlation'];
        this.url = 'https://mindafansub.me';
        this.path = '/manga/list-mode/';
    }
}
*/