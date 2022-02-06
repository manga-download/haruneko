// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ScansMangasxyz.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scansmangasxyz', `ScansMangas (XYZ)`, 'https://scansmangas.xyz' /*, Tags.Language.English, Tags ... */);
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