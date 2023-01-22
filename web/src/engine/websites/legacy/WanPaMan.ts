// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WanPaMan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wanpaman', `Wan-Pa Man`, 'http://galaxyheavyblow.web.fc2.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WanPaMan extends Connector {

    constructor() {
        super();
        super.id = 'wanpaman';
        super.label = 'Wan-Pa Man';
        this.tags = [ 'manga', 'japanese'];
        this.url = 'http://galaxyheavyblow.web.fc2.com';
    }

    async _getMangas() {
        return [
            {
                id: this.url,
                title: this.label
            }
        ];
    }

    async _getChapters(manga) {
        let request = new Request(new URL(manga.id), this.requestOptions);
        let script = `new Promise(resolve => {
            let chapters = [...document.querySelectorAll('body a[href*="imageviewer"]')].map(link => {
                return {
                    id: link.href,
                    title: link.text.trim()
                };
            });
            resolve(chapters.reverse());
        });`;

        return Engine.Request.fetchUI( request, script );
    }

    async _getPages(chapter) {
        let uri = new URL(chapter.id, this.url);
        let rest = [uri.pathname+uri.searchParams.get('aid')];
        rest.push(uri.searchParams.get('iid'));
        rest.push( 'metadata.json?_=' + Date.now() );

        let request = new Request( new URL(rest.join('/'), this.url), this.requestOptions );
        let data = await this.fetchJSON(request);

        return data.imageItemList.map(page => {
            rest.pop();
            rest.push(page.fileName);
            return this.getAbsolutePath(rest.join('/'), this.url);
        });

    }

    async _getMangaFromURI() {
        return new Manga(this, this.url, this.label);
    }
}
*/