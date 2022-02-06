// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ScanlatorHunters.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanlatorhunters', `Scanlator Hunters`, 'https://scanlatorhunters.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ScanlatorHunters extends WordPressMadara {

    constructor() {
        super();
        super.id = 'scanlatorhunters';
        super.label = 'Scanlator Hunters';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://scanlatorhunters.com';
    }
}
*/