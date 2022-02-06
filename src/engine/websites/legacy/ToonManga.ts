// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToonManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonmanga', `ToonManga`, 'https://toonmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToonManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'toonmanga';
        super.label = 'ToonManga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://toonmanga.com';
    }
}
*/