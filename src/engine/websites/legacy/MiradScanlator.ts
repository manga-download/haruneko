// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MiradScanlator.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('miradscanlator', `Mirad Scanlator`, 'https://miradscanlator.site' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MiradScanlator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'miradscanlator';
        super.label = 'Mirad Scanlator';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation', 'hentai' ];
        this.url = 'https://miradscanlator.site';
    }
}
*/