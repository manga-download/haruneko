// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ImperioScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imperioscans', `Império Scans`, 'https://imperioscans.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImperioScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'imperioscans';
        super.label = 'Império Scans';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://imperioscans.com.br';
    }
}
*/