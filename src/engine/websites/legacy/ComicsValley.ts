// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicsValley.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicsvalley', `Comics Valley`, 'https://comicsvalley.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicsValley extends WordPressMadara {

    constructor() {
        super();
        super.id = 'comicsvalley';
        super.label = 'Comics Valley';
        this.tags = [ 'porn', 'english' ];
        this.url = 'https://comicsvalley.com';
    }
}
*/