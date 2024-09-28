import { Tags } from '../Tags';
import icon from './Mangaz.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { type Priority } from './../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';

type ImagePath = {
    img: string,
    scrambleData: ScrambleData
}

type ScrambleData = {
    h: number,
    w: number,
    crops: {
        h: number,
        w: number,
        x: number,
        x2: number,
        y: number,
        y2: number
    }[]
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
        const request = new Request(new URL(`/title/addpage_renewal?query=&page=${page}`, this.URI), {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'h4 > a');
        return data.map(element => new Manga(this, provider, element.pathname, element.text.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.URI));
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
            new Promise(resolve => {
                const jNamespace = JCOMI.namespace("JCOMI.document");
                const jDocument = jNamespace.getDoc();
                const enc = jDocument.Location.enc ? 'enc' : 'anne';
                const imgs = jNamespace.getOrders().map(ele => {
                    const img = jNamespace.getLocationDirAnne(enc) + ele.name + "?" + jDocument.verkey;
                    return { img, scrambleData : ele.scramble };
                });
                resolve(imgs);
            });
        `;
        const request = new Request(new URL(chapter.Identifier, this.URI));
        const data = await FetchWindowScript<ImagePath[]>(request, script, 2500);
        return data.map(image => new Page<ScrambleData>(this, chapter, new URL(image.img, this.URI), image.scrambleData));
    }

    public override async FetchImage(page: Page<ScrambleData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const scrambleData = page.Parameters;
        return DeScramble(blob, async (image, ctx) => {
            ctx.canvas.width = scrambleData.w;
            ctx.canvas.height = scrambleData.h;
            for (let crop of scrambleData.crops) {
                ctx.drawImage(image, crop.x2, crop.y2, crop.w, crop.h, crop.x, crop.y, crop.w, crop.h);
            }
        });
    }
}