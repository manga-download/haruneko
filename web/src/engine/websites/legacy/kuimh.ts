// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './kuimh.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kuimh', `酷爱漫画 (Kuimh)`, 'https://www.kuimh.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class kuimh extends MH {

    constructor() {
        super();
        super.id = 'kuimh';
        super.label = '酷爱漫画 (Kuimh)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://www.kuimh.com';
    }
}
*/