// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ApollComics.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('apollcomics', `Apoll Comics`, 'https://apollcomics.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ApollComics extends WordPressMadara {

    constructor() {
        super();
        super.id = 'apollcomics';
        super.label = 'Apoll Comics';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://apollcomics.xyz';
    }
}
*/