// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ColoredManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('coloredmanga', `Colored Manga`, 'https://coloredmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ColoredManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'coloredmanga';
        super.label = 'Colored Manga';
        this.tags = ['manga', 'english'];
        this.url = 'https://coloredmanga.com';
    }
}
*/