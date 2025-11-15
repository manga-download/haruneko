// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './CrunchyAnime.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('crunchyanime', `Crunchyroll* (Anime)`, 'https://www.crunchyroll.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CrunchyAnime extends Crunchyroll {

    constructor() {
        super();
        super.id = 'crunchyanime';
        super.label = 'Crunchyroll* (Anime)';
        this.tags = [ 'anime', 'high-quality', 'multi-lingual' ];
    }

    async _getMangas() {
        throw new Error('Not implemented!');
    }

    async _getChapters(/*manga*) {
        throw new Error('Not implemented!');
    }

    async _getPages(/*chapter*) {
        throw new Error('Not implemented!');
    }
}
*/