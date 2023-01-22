// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ManhwasNet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/manhwas\.net\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.listttl ul li a', '/manga-list/?list')
@MangaStream.ChaptersSinglePageCSS('div#chapter_list span.eps a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwasnet', 'Manhwas', 'https://manhwas.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwasNet extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'manhwasnet';
        super.label = 'Manhwas';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://manhwas.net';
        this.path = '/manga-list/?list';

        this.queryMangas = 'div.listttl ul li a';
        this.queryChapters = 'div#chapter_list span.eps a';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.reader-area img[src]:not([src=""])';
    }
}
*/