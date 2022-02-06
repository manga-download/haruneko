// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SDLGFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sdlgfansub', `SDLG Fansub`, 'https://www.sdlg-fansub.tk' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SDLGFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sdlgfansub';
        super.label = 'SDLG Fansub';
        this.tags = [ 'hentai', 'spanish' ];
        this.url = 'https://www.sdlg-fansub.tk';
    }
}
*/