// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DropeScanSensainaYuri.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sensainayuri', `Sensaina Yuri (Drope Scan)`, 'https://sensainayuri.dropescan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DropeScanSensainaYuri extends WordPressMadara {
    constructor() {
        super();
        super.id = 'sensainayuri';
        super.label = 'Sensaina Yuri (Drope Scan)';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://sensainayuri.dropescan.com';
        this.language = 'pt';
    }
}
*/