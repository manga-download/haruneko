// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './StoriaDash.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('storiadash', `ストーリアダッシュ (Storia Dash)`, 'https://storia.takeshobo.co.jp' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class StoriaDash extends TakeShobo {

    constructor() {
        super();
        super.id = 'storiadash';
        super.label = 'ストーリアダッシュ (Storia Dash)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://storia.takeshobo.co.jp';
    }
}
*/