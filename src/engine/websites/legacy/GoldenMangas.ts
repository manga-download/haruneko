// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GoldenMangas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('goldenmangas', `GoldenMangas`, 'https://goldenmanga.top' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GoldenMangas extends Connector {

    constructor() {
        super();
        super.id = 'goldenmangas';
        super.label = 'GoldenMangas';
        this.tags = ['manga', 'portuguese'];
        this.url = 'https://goldenmanga.top';
    }

    /**
     *
     *
    _getMangaListFromPages(mangaPageLinks, index) {
        if (index === undefined) {
            index = 0;
        }
        return this.wait(0)
            .then(() => this.fetchDOM(mangaPageLinks[index], 'div.mangas a', 5))
            .then(data => {
                let mangaList = data.map(element => {
                    return {
                        id: this.getRelativeLink(element),
                        title: element.text.trim()
                    };
                });
                if (index < mangaPageLinks.length - 1) {
                    return this._getMangaListFromPages(mangaPageLinks, index + 1)
                        .then(mangas => mangas.concat(mangaList));
                } else {
                    return Promise.resolve(mangaList);
                }
            });
    }

    /**
     *
     *
    _getMangaList(callback) {
        this.fetchDOM(this.url + '/mangas', 'nav ul.pagination li:nth-last-child(2) a')
            .then(data => {
                let pageCount = parseInt(data[0].text.trim());
                let pageLinks = [... new Array(pageCount).keys()].map(page => this.url + '/mangas?pagina=' + (page + 1));
                return this._getMangaListFromPages(pageLinks);
            })
            .then(data => {
                callback(null, data);
            })
            .catch(error => {
                console.error(error, this);
                callback(error, undefined);
            });
    }

    /**
     *
     *
    _getChapterList(manga, callback) {
        this.fetchDOM(this.url + manga.id, 'ul#capitulos li.row > a div:first-of-type')
            .then(data => {
                console.log(data);
                let chapterList = data.map(element => {
                    return {
                        id: this.getRelativeLink(element.parentNode),
                        title: element.childNodes[2].data.trim(),
                        language: 'pt'
                    };
                });
                callback(null, chapterList);
            })
            .catch(error => {
                console.error(error, manga);
                callback(error, undefined);
            });
    }

    /**
     *
     *
    _getPageList(manga, chapter, callback) {
        this.fetchDOM(this.url + chapter.id, 'div#leitor_full div[id^="capitulos"]:not([style*="none"]) source.img-manga')
            .then(data => {
                let pageList = data.map(element => this.url + this.getRelativeLink(element));
                callback(null, pageList);
            })
            .catch(error => {
                console.error(error, chapter);
                callback(error, undefined);
            });
    }
}
*/