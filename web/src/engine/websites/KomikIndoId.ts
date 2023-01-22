// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikIndoId.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komikindo\.id\/manga\/[^/]+\/$/, 'main div.post-body h1.entry-title')
@MangaStream.MangasSinglePageCSS('.daftarkartun #abtext .jdlbar ul li a', '/daftar-komik/?list')
@MangaStream.ChaptersSinglePageCSS('div#chapter_list span.lchx a')
@MangaStream.PagesSinglePageCSS([], 'div.chapter-area div.chapter-image img[src]:not([src=""])')
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindoid', 'KomikIndoId', 'https://komikindo.id', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikIndoId extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikindoid';
        super.label = 'KomikIndoId';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikindo.id';
        this.path = '/daftar-komik/?list';

        this.querMangaTitleFromURI = 'main div.post-body h1.entry-title';
        this.queryMangas = '.daftarkartun #abtext .jdlbar ul li a';
        this.queryChapters = 'div#chapter_list span.lchx a';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.chapter-area div.chapter-image img[src]:not([src=""])';
    }
}
*/