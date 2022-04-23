// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaSwat.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaswat', `SWAT Manga`, 'https://swatmanga.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSwat extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangaswat';
        super.label = 'SWAT Manga';
        this.tags = ['webtoon', 'arabic'];
        this.url = 'https://swatmanga.co';
        this.path = '/manga/?list';

        this.queryChapters = 'div.bxcl ul li span.lchx a';
        this.queryChaptersTitle = undefined;
    }
}
*/