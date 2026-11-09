import { Tags } from '../Tags';
import icon from './Mangaz.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { type Priority } from './../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';

type ImagePath = {
    img: string;
    scrambleData: ScrambleData;
};

type ScrambleData = {
    h: number;
    w: number;
    crops: {
        h: number;
        w: number;
        x: number;
        x2: number;
        y: number;
        y2: number;
    }[];
};

@Common.MangaCSS(/^{origin}\/series\/detail\/\d+$/, 'li.title')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaz', `Manga Library Z (マンガ図書館Z)`, 'https://www.mangaz.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run ; page++) {
                const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`/title/addpage_renewal?query=&page=${page}`, this.URI), {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }), 'h4 > a');
                const mangas = data.map(({ pathname, text }) => new Manga(this, provider, pathname, text.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [body] = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'body');
        if (body.querySelector('li.item')) {
            return [...body.querySelectorAll('li.item')]
                .map(ele => new Chapter(this, manga, ele.querySelector('button').dataset['url'].replace('navi', 'virgo/view'), ele.querySelector('span.title').textContent.trim()));
        } else {
            return [new Chapter(this, manga, body.querySelector('button').dataset['url'].replace('navi', 'virgo/view'), manga.Title)];
        };
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
        const data = await FetchWindowScript<ImagePath[]>(new Request(new URL(chapter.Identifier, this.URI)), script, 2500);
        return data.map(({ img, scrambleData }) => new Page<ScrambleData>(this, chapter, new URL(img, this.URI), scrambleData));
    }

    public override async FetchImage(page: Page<ScrambleData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const { crops, h, w } = page.Parameters;
        return DeScramble(blob, async (image, ctx) => {
            ctx.canvas.width = w;
            ctx.canvas.height = h;
            for (let crop of crops) {
                ctx.drawImage(image, crop.x2, crop.y2, crop.w, crop.h, crop.x, crop.y, crop.w, crop.h);
            }
        });
    }
}