// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangasRaw.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasraw', `MangasRaw`, 'https://mangas-raw.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangasRaw extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangasraw';
        super.label = 'MangasRaw';
        this.tags = [ 'manga', 'japanese', 'raw' ];
        this.url = 'https://mangas-raw.com';
        this.path = '/manga/list-mode/';
    }

    async _getMangas() {
        let mangaList = [];
        for (let path = '/manga', mangas = []; path !== null;) {
            ({ path, mangas } = await this._getMangasFromPage(path));
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async _getMangasFromPage(path) {
        const uri = new URL(path, this.url);
        const request = new Request(uri, this.requestOptions);
        const content = await this.fetchDOM(request, 'div#content');
        const data = [...content[0].querySelectorAll('div.listupd div.bs div.bsx > a')];
        const next = content[0].querySelector('ul.pagination a.next.page-numbers');
        return {
            path: next ? next.pathname + next.search : null,
            mangas: data.map(element => {
                return {
                    id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                    title: element.title.trim()
                };
            })
        };
    }
}
*/