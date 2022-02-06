// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaRow.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarow', `MangaRow`, 'https://www.mangarow.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaRow extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangarow';
        super.label = 'MangaRow';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://www.mangarow.com';
    }
}
*/