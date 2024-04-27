import { Tags } from '../Tags';
import icon from './Mangaz.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { type Priority } from './../taskpool/TaskPool';

type ImgObj = {
    img: string[],
    b: {
        Enc: {
            key: string,
            iv: string
        }
    }
}

@Common.MangaCSS(/^{origin}\/series\/detail\/\d+$/, 'li.title')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaz', `Manga Library Z (マンガ図書館Z)`, 'https://www.mangaz.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL(`/title/addpage_renewal?query=&page=${page}`, this.URI).href, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'h4 > a');
        return data.map(element => new Manga(this, provider, element.pathname, element.text.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.URI).href);
        const data = await FetchCSS(request, 'body');
        if(data[0].querySelector('li.item')) {
            return [ ...data[0].querySelectorAll('li.item') ]
                .map(ele => new Chapter(this, manga, ele.querySelector('button').dataset['url'].replace('navi', 'virgo/view'), ele.querySelector('span.title').textContent.trim()));
        } else {
            return [ new Chapter(this, manga, data[0].querySelector('button').dataset['url'].replace('navi', 'virgo/view'), manga.Title) ];
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const script = `
            new Promise(async (resolve,reject) => {
                let g = JCOMI.namespace("JCOMI.document")
                let b = g.getDoc()
                let img = g.getImages().map(ele => g.getLocationDir('enc') + ele.file + "?vw=" + encodeURIComponent(JCOMI.namespace("JCOMI.config").getVersion()))
                resolve({img:img,b:b});
            });
        `;
        const request = new Request(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchWindowScript<ImgObj>(request, script);
        return data.img.map(ele => new Page(this, chapter, new URL(ele), data.b.Enc));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        const encrypted = await new Response(data).arrayBuffer();
        const iv = Buffer.from(window.btoa(page.Parameters.iv as string), 'base64');
        const key = Buffer.from(page.Parameters.key as string, 'utf-8');

        const secretKey = await crypto.subtle.importKey(
            'raw',
            key,
            {
                name: 'AES-CBC',
                length: 128
            }, true, ['encrypt', 'decrypt']);

        let decrypted = await crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv: iv,
        }, secretKey, encrypted,);

        const sdecrypted = new TextDecoder('utf-8').decode(decrypted);
        decrypted = Uint8Array.from(window.atob(sdecrypted), char => char.charCodeAt(0));
        return await Common.GetTypedData(decrypted);
    }
}