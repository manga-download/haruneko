// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './COMICMeDu.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicmedu', `COMIC MeDu (こみっくめづ)`, 'https://comic-medu.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class COMICMeDu extends Connector {

    constructor() {
        super();
        super.id = 'comicmedu';
        super.label = 'COMIC MeDu (こみっくめづ)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'http://comic-medu.com';

        this.path = [ '/wk' ];
        this.queryMangaListCount = 'article div#conMain div.conDoc ul.pagination li';
        this.queryManga = 'article div#conMain div.conDoc div#listB div.listM';
        this.queryMangaLink = 'a';
        this.queryMangaTitle = 'h3.listTtl';

        this.queryChapters = 'article div#conMain div.conDoc ul.episode li a';
        this.queryShortChapter = 'article div#conMain div.conDoc div.btDetail a.btDetailR';

        this.queryPages = 'article div.swiper-container div.swiper-wrapper div.swiper-slide source[class*="storyImg"]';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'head title');
        let id = uri.pathname;
        let title = data[0].text.split('｜')[0].trim();
        return new Manga(this, id, title);
    }

    async _mapMangas(mangas) {
        return mangas.map(series => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(series.querySelector(this.queryMangaLink), this.url),
                title: series.querySelector(this.queryMangaTitle).textContent
            };
        });
    }

    async _getMangas() {
        let uri = new URL(this.url + this.path[0]);
        let request = new Request(uri, this.requestOptions);
        let seriesPages = await this.fetchDOM(request, this.queryMangaListCount);
        let totalPages = seriesPages.length;
        let mangas = await this.fetchDOM(request, this.queryManga);
        let mangaList = await this._mapMangas(mangas);
        for(let page = 2; page <= totalPages; page++) {
            uri.searchParams.set('page', page);
            request = new Request(uri, this.requestOptions);
            mangas = await this._mapMangas(await this.fetchDOM(request, this.queryManga));
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async _getChapters(manga) {
        let uri = new URL(this.url + manga.id);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryChapters);
        if(data.length == 0) { // series is a short story; only one chapter
            data = await this.fetchDOM(request, this.queryShortChapter);
            data[0].textContent = manga.title;
        }
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.textContent
            };
        });
    }

    async _getPages(chapter) {
        let uri = new URL(this.url + chapter.id);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryPages);
        return data.map(element => this.getAbsolutePath(element, request.url));
    }
}
*/