// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaAction.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaaction', `مانجا اكشن (Manga Action)`, 'https://mangaaction.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaAction extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaaction';
        super.label = 'مانجا اكشن (Manga Action)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangaaction.com';
    }
}
*/