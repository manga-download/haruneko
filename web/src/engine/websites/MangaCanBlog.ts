// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaCanBlog.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangacanblog\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.blix ul li a.series', '/daftar-komik-manga-bahasa-indonesia.html')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacanblog', 'MangaCan Blog', 'https://mangacanblog.com', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaCanBlog extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangacanblog';
        super.label = 'MangaCan Blog';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://mangacanblog.com';
        this.path = '/daftar-komik-manga-bahasa-indonesia.html';
        this.queryMangas = 'div.blix ul li a.series';
    }

}
*/