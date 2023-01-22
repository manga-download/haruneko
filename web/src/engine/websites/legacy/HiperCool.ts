// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HiperCool.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hipercool', `Hiper Cool`, 'https://hiper.cool' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HiperCool extends Connector {

    constructor() {
        super();
        super.id = 'hipercool';
        super.label = 'Hiper Cool';
        this.tags = [ 'manga', 'portuguese', 'hentai' ];
        this.url = 'https://hiper.cool';
    }

    async _getMangas() {
        let page = 1;
        let morePages = true;

        let request, data;

        let mangas = [];

        while ( morePages ) {
            try {
                request = new Request(new URL('/home/' + page, this.url), this.requestOptions);
                data = await this.fetchDOM(request, '.news-list > li');
                page++;

                for (let manga of data) {
                    mangas.push(
                        {
                            id: manga.querySelector('a.news-thumb').pathname,
                            title: manga.querySelector('div.title').innerText.trim().replace(/\s+\d{2}(?: Final)?$/, '').trim()
                        }
                    );
                }
            } catch(error) {
                morePages = false;
            }
        }

        return mangas;
    }

    async _getChapters(manga) {
        let request = new Request(new URL(manga.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'ul.chapter-list li a.title');

        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: "Chapter "+element.pathname.split('/').pop(),
                language: 'pt'
            };
        });
    }

    async _getPages(chapter) {
        let request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.pages source');
        return data.map(element => this.getAbsolutePath(element, request.url));
    }

    async _getMangaFromURI(uri) {
        let request = new Request(new URL(uri.href), this.requestOptions);
        let data = await this.fetchDOM(request, '.title-bar span');
        return new Manga(this, uri.pathname, data[0].textContent);
    }

}
*/