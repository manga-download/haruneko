// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhuaBox.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuabox', `ManhuaBox`, 'https://manhuabox.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhuaBox extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuabox';
        super.label = 'ManhuaBox';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhuabox.net';

        this.queryPages = 'div.reading-content p source';
    }
}
*/