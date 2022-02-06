// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TuMangaOnlineHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tumangaonlinehentai', `TMOHentai`, 'https://tmohentai.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TuMangaOnlineHentai extends Connector {

    constructor() {
        super();
        super.id = 'tumangaonlinehentai';
        super.label = 'TMOHentai';
        this.tags = ['hentai', 'spanish'];
        this.url = 'https://tmohentai.com';
        this.links = {
            login: 'https://tmohentai.com/login'
        };
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.panel-title div.panel-heading h3.truncate');
        let id = uri.pathname.split('/').pop();
        let title = data[0].innerText.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let mangaList = [];
        for (let page = 1, hasNext = true; hasNext; page++) {
            let request = new Request(this.url + '/section/all?view=list&order=alphabetic&page=' + page, this.requestOptions);
            const body = (await this.fetchDOM(request, 'body'))[0];
            let data = [...body.querySelectorAll('div.panel-body table.table tbody tr td.text-left a')];
            let mangas = data.map(element => {
                return {
                    id: this.getRootRelativeOrAbsoluteLink(element, this.url).replace('/contents/', ''),
                    title: element.text.trim()
                };
            });
            mangaList.push(...mangas);
            hasNext = !body.querySelector('ul.pagination li:first-child + li[class*="disabled"]');
        }
        return mangaList;
    }

    async _getChapters(manga) {
        return [{
            id: manga.id,
            title: manga.title,
            language: ''
        }];
    }

    async _getPages(chapter) {
        let request = new Request(`${this.url}/reader/${chapter.id}/cascade`, this.requestOptions);
        let data = await this.fetchDOM(request, 'div#content-images source.content-image');
        return data.map(element => this.getAbsolutePath(element.dataset['original'] || element, request.url));
    }
}
*/