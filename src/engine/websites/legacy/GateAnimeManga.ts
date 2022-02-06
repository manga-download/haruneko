// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GateAnimeManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gateanimemanga', `GateAnimeMANGA`, 'https://manga.gateanime.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GateAnimeManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'gateanimemanga';
        super.label = 'GateAnimeMANGA';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://manga.gateanime.com';
    }
}
*/