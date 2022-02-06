// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FirstKiss.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('firstkiss', `1st Kiss Manga`, 'https://1stkissmanga.io' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FirstKiss extends WordPressMadara {

    constructor() {
        super();
        super.id = 'firstkiss';
        super.label = '1st Kiss Manga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://1stkissmanga.io';
    }
}
*/