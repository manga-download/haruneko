// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './JiroComics.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jirocomics', `JiroComics`, 'https://jirocomics.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class JiroComics extends WordPressMadara {

    constructor() {
        super();
        super.id = 'jirocomics';
        super.label = 'JiroComics';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://jirocomics.com';
    }
}
*/