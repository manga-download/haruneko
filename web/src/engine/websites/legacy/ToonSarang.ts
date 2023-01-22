// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToonSarang.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonsarang', `ToonSarang`, 'https://toonsarang.lol' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToonSarang extends GnuBoard5BootstrapBasic2 {

    constructor() {
        super();
        super.id = 'toonsarang';
        super.label = 'ToonSarang';
        this.tags = [ 'webtoon', 'korean' ];
        this.url = 'https://toonsarang.lol';

        this.path = [ '/웹툰', '/포토툰' ];
        this.scriptPages = `
            new Promise(resolve => {
                resolve([...document.querySelectorAll('div#bo_v_con img')].map(img => img.src));
            });
        `;
    }

    async _getChapters(manga) {
        let request = new Request(new URL(manga.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.contents-list ul li a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: [...element.querySelector('div.content-title').childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).find(t => t.length > 0).replace(manga.title, '').trim(),
                language: ''
            };
        });
    }
}
*/