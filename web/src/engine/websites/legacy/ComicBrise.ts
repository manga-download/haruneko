// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicBrise.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicbrise', `comicBrise`, 'https://www.comic-brise.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicBrise extends SpeedBinb {

    constructor() {
        super();
        super.id = 'comicbrise';
        super.label = 'comicBrise';
        this.tags = ['manga', 'japanese'];
        this.url = 'https://www.comic-brise.com';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, '.post-title');
        let id = uri.pathname;
        let title = data[0].innerText.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        const request = new Request(new URL('/titlelist', this.url), this.requestOptions);
        const data = await this.fetchDOM(request, ".list-works a");
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element.pathname, this.url),
                title: element.innerText.trim()
            };
        });
    }
    async _getChapters(manga) {
        const uri = new URL(manga.id, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, '.modal.modal-chapter .modal-body');
        return data.reverse()
            .filter(e => e.querySelector(".banner-trial source").getAttribute("alt") == "FREE")
            .map(element => {
                return {
                    id: element.querySelector('.banner-trial a').pathname,
                    title: element.querySelector('.primary-title').textContent.trim()
                };
            });
    }
}
*/