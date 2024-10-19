import { Tags } from '../Tags';
import icon from './EighteenComic.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
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
        resolve ( [...document.querySelectorAll('div.row.thumb-overlay-albums img')].map(image => {
            const imageNumber = image.parentNode.id.split('.')[0];
            const seed = aid > scramble_id ? get_num(window.btoa(aid), window.btoa(imageNumber)) : 0;
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
        const chapters = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'div.episode ul a', Common.AnchorInfoExtractor(false, 'span'));
        return chapters.length > 0 ? chapters : [new Chapter(this, manga, manga.Identifier.replace('/album/', '/photo/'), manga.Title)];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<Seed>[]> {
        const pages = await FetchWindowScript<PageSeed[]>(new Request(new URL(chapter.Identifier, this.URI)), pageScript, 1500);
        return pages.filter(page => page.url)
            .map(page => new Page<Seed>(this, chapter, new URL(page.url), { seed: page.seed }));
    }

    public override async FetchImage(page: Page<Seed>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const seed = page.Parameters.seed;
        return seed === 0 ? blob : DeScramble(blob, async (image, ctx) => {
            const l = image.height % seed ;
            for (let index = 0; index < seed; index++) {
                let sourceHeight = Math.floor(image.height / seed);
                let destinationY = sourceHeight * index;
                const sourceY = image.height - sourceHeight * (index + 1) - l;
                index == 0 ? sourceHeight += l : destinationY += l;
                ctx.drawImage(image, 0, sourceY, image.width, sourceHeight, 0, destinationY, image.width, sourceHeight);
            }
        });
    }
}