// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MuchoDoujins.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('muchodoujins', `MuchoDoujins`, 'https://muchodoujins.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MuchoDoujins extends WordPressMadara {

    constructor() {
        super();
        super.id = 'muchodoujins';
        super.label = 'MuchoDoujins';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://muchodoujins.com';
    }
}
*/