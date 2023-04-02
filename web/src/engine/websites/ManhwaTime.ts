// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ManhwaTime.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/manhwatime\.xyz\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.animepost div.animposx > a', '/manhwa/?list')
@MangaStream.ChaptersSinglePageCSS('div#chapter_list span.lchx a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwatime', 'Manhwa Time', 'https://manhwatime.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Erotica);
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