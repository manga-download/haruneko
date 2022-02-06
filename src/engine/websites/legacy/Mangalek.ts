// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Mangalek.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalek', `مانجا ليك (Mangalek)`, 'https://mangalek.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangalek extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangalek';
        super.label = 'مانجا ليك (Mangalek)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangalek.com';

        this.queryTitleForURI = 'div.profile-manga div.post-title h1';
        this.queryMangas = 'div.page-content-listing:not(#loop-content) div.post-title h3 a';
    }

    async _getMangas() {
        let mangaList = [];
        for(let page = 1, run = true; run; page++) {
            let mangas = await this._getMangasFromPage(page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        let uri = new URL(`/manga/page/${page}/`, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryMangas);
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.trim()
            };
        });
    }
}
*/