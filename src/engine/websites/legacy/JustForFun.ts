// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './JustForFun.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('justforfun', `Just for Fun`, 'https://just-for-fun.ru' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class JustForFun extends WordPressMadara {

    constructor() {
        super();
        super.id = 'justforfun';
        super.label = 'Just for Fun';
        this.tags = [ 'manga', 'russian' ];
        this.url = 'https://just-for-fun.ru';
    }
}
*/