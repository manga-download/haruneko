// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './OrigamiOrpheans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('origamiorpheans', `ORIGAMI ORPHEANS`, 'https://origami-orpheans.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OrigamiOrpheans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'origamiorpheans';
        super.label = 'ORIGAMI ORPHEANS';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://origami-orpheans.com.br';
    }
}
*/