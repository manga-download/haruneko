// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NovelMic.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelmic', `NovelMic`, 'https://novelmic.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelMic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'novelmic';
        super.label = 'NovelMic';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://novelmic.com';
    }
}
*/