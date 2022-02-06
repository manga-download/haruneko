// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwaTime.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwatime', `Manhwa Time`, 'https://manhwatime.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaTime extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'manhwatime';
        super.label = 'Manhwa Time';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://manhwatime.xyz';
        this.path = '/manhwa/?list';

        this.queryMangas = 'div.animepost div.animposx > a';
        this.queryChapters = 'div#chapter_list span.lchx a';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.reader-area img[src]:not([src=""])';
    }

    async _getMangas() {
        const mangas = await super._getMangas();
        mangas.forEach(manga => manga.title = manga.title.replace(/Manhwa$/i, '').trim());
        return mangas;
    }

    async _getChapters(manga) {
        const chapters = await super._getChapters(manga);
        chapters.forEach(chapter => chapter.title = chapter.title.replace(/^Manhwa/i, '').trim());
        return chapters;
    }
}
*/