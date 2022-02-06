// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TruyenTranhAudioOnline.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyentranhaudioonline', `Truyện tranh audio`, 'https://truyentranhaudio.online' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TruyenTranhAudioOnline extends WordPressMadara {

    constructor() {
        super();
        super.id = 'truyentranhaudioonline';
        super.label = 'Truyện tranh audio';
        this.tags = [ 'webtoon', 'vietnamese' ];
        this.url = 'https://truyentranhaudio.online';

        this.queryPages = 'div.reading-content source';
    }
}
*/