// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ProjetoScanlator.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('projetoscanlator', `Projeto Scanlator`, 'https://projetoscanlator.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ProjetoScanlator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'projetoscanlator';
        super.label = 'Projeto Scanlator';
        this.tags = [ 'manga', 'portuguese' ];
        this.url = 'https://projetoscanlator.com';
    }
}
*/