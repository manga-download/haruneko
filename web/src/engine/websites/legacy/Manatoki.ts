// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

import { Tags } from '../../Tags';
import icon from './Manatoki.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import { FetchCSS } from '../../platform/FetchProvider';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manatoki', `Manatoki`, 'https://manatoki0.net', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = (await FetchCSS<HTMLAnchorElement>(new Request('https://t.me/s/newtoki5'), 'a[href^="https://manatoki"]')).at(-1)?.origin ?? this.URI.href;
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}

// Original Source
/*
class Manatoki extends GnuBoard5BootstrapBasic2 {

    constructor() {
        super();
        super.id = 'manatoki';
        super.label = 'Manatoki';
        this.tags = [ 'manga', 'webtoon', 'korean' ];
        this.url = 'https://manatoki.net';

        this.path = [ '/webtoon', '/comic' ];
        this.queryMangasPageCount = 'div.list-page ul.pagination li:last-child a';
        this.queryMangas = 'ul#webtoon-list-all li div.img-item div.in-lable a';
        this.queryManga = 'meta[name="subject"]';
        this.queryChapters = 'div.serial-list li.list-item div.wr-subject a';
        this.queryChaptersTitleBloat = 'span.orangered';
        this.scriptPages = `
        new Promise(resolve => {
            const images = [...document.querySelectorAll('div.view-padding div > img, div.view-padding div > p:not([class]) img')];
            resolve(images.map(image => JSON.stringify(image.dataset).match(/"\\S{11}":"(.*)"/)[1]));
        });
        `;

    }
    canHandleURI(uri) {
        return /https?:\/\/manatoki\d*.net/.test(uri.origin);
    }

    async _initializeConnector() {
        let uri = new URL(this.url);
        let request = new Request(uri.href, this.requestOptions);
        this.url = await Engine.Request.fetchUI(request, `window.location.origin`);
        this.requestOptions.headers.set('x-referer', this.url);
        console.log(`Assigned URL '${this.url}' to ${this.label}`);
    }

    async _getMangas() {
        let mangaList = [];
        for(let path of this.path) {
            let uri = new URL(path, this.url);
            let request = new Request(uri, this.requestOptions);
            let data = await this.fetchDOM(request, this.queryMangasPageCount);
            let pageCount = parseInt(data[0].href.match(/\d+$/)[0]);
            for(let page = 1; page <= pageCount; page++) {
                let mangas = await this._getMangasFromPage(path + '/p' + page);
                mangaList.push(...mangas);
            }
        }
        return mangaList;
    }
}
*/