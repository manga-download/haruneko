// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaBoruto.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/sensibleiowans\.org\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaboruto', 'Manga Boruto', 'https://sensibleiowans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaBoruto extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangaboruto';
        super.label = 'Manga Boruto';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://sensibleiowans.org';
        this.path = '/manga/list-mode/';
    }
}
*/