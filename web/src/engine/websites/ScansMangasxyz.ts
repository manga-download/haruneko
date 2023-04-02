// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ScansMangasxyz.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/scansmangas\.xyz\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.bigor > a', '/tous-nos-mangas/')
@MangaStream.ChaptersSinglePageCSS('span.lchx.desktop > a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scansmangasxyz', 'ScansMangas (XYZ)', 'https://scansmangas.xyz', Tags.Media.Manga, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ScansMangasxyz extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'scansmangasxyz';
        super.label = 'ScansMangas (XYZ)';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://scansmangas.xyz';
        this.path = '/tous-nos-mangas/';

        this.queryMangas = 'div.bigor > a';
        this.queryChapters = 'span.lchx.desktop > a';
        this.queryChaptersTitle = undefined;
    }

    async _getPages(chapter) {
        let pagelist = [];
        const request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        const data = (await this.fetchDOM(request, 'body'))[0];
        const lenloop = parseInt(data.querySelector('div.nav_apb > a:nth-last-of-type(2)').text);
        for (let i = 1; i <= lenloop; i++) {
            pagelist.push(data.querySelector('a[rel=nofollow] > source').src.replace(/(\d+)(\.)/, i+'$2'));
        }
        return pagelist;
    }
}
*/