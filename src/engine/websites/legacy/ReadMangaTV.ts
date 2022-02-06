// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReadMangaTV.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readmangatv', `readmanga.tv`, 'https://readmanga.tv' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadMangaTV extends WordPressMadara {

    constructor() {
        super();
        super.id = 'readmangatv';
        super.label = 'readmanga.tv';
        this.tags = [ 'manga', 'novel', 'hentai', 'porn', 'japanese' ];
        this.url = 'https://readmanga.tv';
    }
}
*/