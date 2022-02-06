// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReadRawManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readrawmanga', `ReadRawManga`, 'https://www.readrawmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadRawManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'readrawmanga';
        super.label = 'ReadRawManga';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://www.readrawmanga.com';
    }
}
*/