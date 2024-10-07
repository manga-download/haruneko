import { Tags } from '../Tags';
import icon from './EighteenComic.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
function MangaInfoExtractor(element: HTMLDivElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector<HTMLImageElement>('img').alt.trim()
    };
}

const pageScript = `
    new Promise ( resolve => {
        const imagenodes = [...document.querySelectorAll('div.row.thumb-overlay-albums img')];
        const scrambled = aid > scramble_id;
        resolve ( imagenodes.map(image => {
            const imageNumber = image.parentNode.id.split('.')[0];
            const seed = scrambled ? get_num(window.btoa(aid), window.btoa(imageNumber)) : -1;
            return {
                url : image.dataset.original,
                seed
            };
        }));
    });
`;

type PageSeed = {
    url: string,
    seed: number
}

type Seed = {
    seed: number
}

@Common.MangaCSS(/^{origin}\/album\/\d+\//, 'div[itemprop="name"] h1#book-name')
@Common.MangasMultiPageCSS('/albums?page={page}', 'div.row div.thumb-overlay-albums', 1, 1, 0, MangaInfoExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('18comic', '18comic', 'https://18comic.org', Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const dom = await FetchHTML(new Request(new URL(manga.Identifier, this.URI)));
        const chapterlist = [...dom.querySelectorAll<HTMLAnchorElement>('div.episode ul a')];
        return chapterlist.length > 0 ? chapterlist.map(chapter => {
            const spanbloat = chapter.querySelector('span');
            if (spanbloat) spanbloat.parentNode.removeChild(spanbloat);
            return new Chapter(this, manga, chapter.pathname, chapter.text.replace(manga.Title, '').trim());
        }) : [new Chapter(this, manga, manga.Identifier.replace('/album/', '/photo/'), manga.Title)];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<Seed>[]> {
        const pages = await FetchWindowScript<PageSeed[]>(new Request(new URL(chapter.Identifier, this.URI)), pageScript, 1500);
        return pages.filter(page => page.url)
            .map(page => new Page<Seed>(this, chapter, new URL(page.url), { seed: page.seed }));
    }

    public override async FetchImage(page: Page<Seed>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return page.Parameters.seed === -1 ? blob : DeScramble(blob, async (image, ctx) => {
            const seed = page.Parameters.seed;
            const l = image.height % seed ;
            for (let index = 0; index < seed; index++) {
                let c = Math.floor(image.height / seed);
                let g = c * index;
                let w = image.height - c * (index + 1) - l;
                index == 0 ? c += l : g += l;
                ctx.drawImage(image, 0, w, image.width, c, 0, g, image.width, c);
            }
        });
    }
}