// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NovelFrance.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelfrance', `Novel France`, 'http://novel-france.fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelFrance extends WordPressMadara {

    constructor() {
        super();
        super.id = 'novelfrance';
        super.label = 'Novel France';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'http://novel-france.fr';
    }
}
*/