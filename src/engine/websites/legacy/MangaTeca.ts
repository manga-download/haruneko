// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaTeca.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangateca', `MangaTeca`, 'https://www.mangateca.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaTeca extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangateca';
        super.label = 'MangaTeca';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'portuguese' ];
        this.url = 'https://www.mangateca.com';
    }
}
*/