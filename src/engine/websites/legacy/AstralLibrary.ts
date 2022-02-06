// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AstralLibrary.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('astrallibrary', `Astral Library`, 'https://www.astrallibrary.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AstralLibrary extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'astrallibrary';
        super.label = 'Astral Library';
        this.tags = [ 'webtoon', 'novel', 'english' ];
        this.url = 'https://www.astrallibrary.net';

        this.queryMangas = 'div.post-title h3 a:last-of-type';
        this.novelObstaclesQuery = 'div.ad';
    }

    async _getChapters(manga) {
        const chapters = await super._getChapters(manga);
        return chapters.filter(chapter => !/^http/.test(chapter.id) && chapter.title !== '');
    }
}
*/