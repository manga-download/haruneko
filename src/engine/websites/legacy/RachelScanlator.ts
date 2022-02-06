// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RachelScanlator.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rachelscanlator', `Rachel Scanlator`, 'https://rachelscanlator.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RachelScanlator extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'rachelscanlator';
        super.label = 'Rachel Scanlator';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://rachelscanlator.com';
    }
}
*/