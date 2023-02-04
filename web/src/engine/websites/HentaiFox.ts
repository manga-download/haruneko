import { Tags } from '../Tags';
import icon from './HentaiFox.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const scriptPages = `
            new Promise((resolve, reject) => {
                    try {
                        const dir = $('#load_dir').val();
                        const id = $('#load_id').val();
                        const images = Object.values(g_th).map((item, index) => {
                            const file = (index + 1) + (item.startsWith('j') ? '.jpg' : '.png');
                            return [ 'https://i.hentaifox.com', dir, id, file ].join('/');
                        });
                        resolve(images);
                    } catch(error) {
                        reject(error);
                    }
            });
        `;

@Common.MangaCSS(/https:\/\/hentaifox\.com\//, 'div.gallery_right div.info h1')
@Common.MangasNotSupported()
@Common.PagesSinglePageJS(scriptPages, 2500)
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaifox', `HentaiFox`, 'https://hentaifox.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [new Chapter(this, manga, manga.Identifier, manga.Title)];
    }
}

// Original Source
/*
class HentaiFox extends Connector {

    constructor() {
        super();
        super.id = 'hentaifox';
        super.label = 'HentaiFox';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://hentaifox.com';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.gallery_right div.info h1', 3);
        let id = uri.pathname;
        let title = data[0].textContent.trim();
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
                        const dir = $('#load_dir').val();
                        const id = $('#load_id').val();
                        const images = Object.values(g_th).map((item, index) => {
                            const file = (index + 1) + (item.startsWith('j') ? '.jpg' : '.png');
                            return [ 'https://i.hentaifox.com', dir, id, file ].join('/');
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