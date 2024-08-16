// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './kuman5.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kuman5', `酷漫屋 (Kuman57)`, 'http://www.kmw6.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class kuman5 extends MH {
    constructor() {
        super();
        super.id = 'kuman5';
        super.label = '酷漫屋 (Kuman57)';
        this.tags = [ 'manga', 'chinese' ];
        this.url = 'http://www.kmwu6.com';

        this.queryChapter = 'div#chapterlistload ul#detail-list-select-1 li a';
        this.path = '/sort/1-%PAGE%.html';
    }

    async _getMangas() {
        let mangaList = [];
        for(let page = 1, run = true; run; page++) {
            let mangas = await this._getMangasFromPage(page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getChapters(manga) {
        const mangaID = /^\/mulu/.test(manga.id) ? manga.id : `/mulu${manga.id}1-1.html`;
        return super._getChapters(Object.assign(manga, { id: mangaID }));
    }

    async _getPages(chapter) {
        let request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        let data = await this.fetchRegex(request, /km5_img_url\s*=\s*['"]([^'"]+)['"]/g);
        return JSON.parse(atob(data[0])).map(page => page.split('|')[1]);
    }
}
*/