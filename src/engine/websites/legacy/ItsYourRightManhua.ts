// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ItsYourRightManhua.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('itsyourightmanhua', `Its Your Right Manhua`, 'https://itsyourightmanhua.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ItsYourRightManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'itsyourightmanhua';
        super.label = 'Its Your Right Manhua';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://itsyourightmanhua.com';
    }
}
*/