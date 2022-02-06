// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AzureManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('azuremanga', `Azure Manga`, 'https://azuremanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AzureManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'azuremanga';
        super.label = 'Azure Manga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://azuremanga.com';
        this.path = '/manga/list-mode/';
    }
}
*/