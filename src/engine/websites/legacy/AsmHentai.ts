// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AsmHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asmhentai', `AsmHentai`, 'https://asmhentai.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AsmHentai extends Connector {

    constructor() {
        super();
        super.id = 'asmhentai';
        super.label = 'AsmHentai';
        this.tags = [ 'hentai', 'multi-lingual' ];
        this.url = 'https://asmhentai.com';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.book_page div.info h1', 3);
        let id = uri.pathname;
        let element = data[0];
        this.cfMailDecrypt(element);
        let title = element.textContent.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let msg = 'This website provides a manga list that is to large to scrape, please copy and paste the URL containing the images directly from your browser into HakuNeko.';
        throw new Error(msg);
    }

    async _getChapters(manga) {
        return [ { ...manga, language: '' } ];
    }

    async _getPages(chapter) {
        const script = `
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const pages = parseInt($("#t_pages").val());
                        const dir = $("#dir").val();
                        const id = $("#id").val();
                        const images = [...new Array(pages)].map((_, index) => {
                            const file = (index + 1) + '.jpg';
                            return [ 'https://images.asmhentai.com', dir, id, file ].join('/');
                        });
                        resolve(images);
                    } catch(error) {
                        reject(error);
                    }
                }, 2500);
            });
        `;
        const uri = new URL(chapter.id, this.url);
        const request = new Request(uri, this.requestOptions);
        return Engine.Request.fetchUI(request, script);
    }
}
*/