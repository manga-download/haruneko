// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaNato.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga-nato', `Manga Nato`, 'https://manga-nato.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaNato extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manga-nato';
        super.label = 'Manga Nato';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://manga-nato.com';
    }
}
*/