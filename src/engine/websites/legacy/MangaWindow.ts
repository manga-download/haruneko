// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaWindow.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangawindow', `MangaWindow (by AnyACG)`, 'https://mangawindow.club' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaWindow extends AnyACG {

    constructor() {
        super();
        super.id = 'mangawindow';
        super.label = 'MangaWindow (by AnyACG)';
        this.tags = [ 'manga', 'multi-lingual' ];
        this.url = 'https://mangawindow.club';
    }
}
*/