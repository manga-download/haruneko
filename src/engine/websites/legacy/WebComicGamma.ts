// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WebComicGamma.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webcomicgamma', `WebComicGamma`, 'https://webcomicgamma.takeshobo.co.jp' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WebComicGamma extends TakeShobo {

    constructor() {
        super();
        super.id = 'webcomicgamma';
        super.label = 'WebComicGamma';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://webcomicgamma.takeshobo.co.jp';
    }
}
*/