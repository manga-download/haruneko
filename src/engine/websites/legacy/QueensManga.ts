// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './QueensManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('queensmanga', `ملكات المانجا (Queens Manga)`, 'https://queensmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class QueensManga extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'queensmanga';
        super.label = 'ملكات المانجا (Queens Manga)';
        this.tags = ['webtoon', 'arabic'];
        this.url = 'https://queensmanga.com';
    }
}
*/