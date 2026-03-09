import { Tags } from '../Tags';
import icon from './EighteenComic.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

const pageScript = `
    new Promise ( resolve => {
        resolve ( [...document.querySelectorAll('div.row.thumb-overlay-albums img')].map(image => {
            const imageNumber = image.parentNode.id.split('.')[0];
            const numPieces = aid > scramble_id ? get_num(window.btoa(aid), window.btoa(imageNumber)) : 0;
            return {
                url : image.dataset.original,
                numPieces
            };
        }));
    });
`;

type PageData = {
    url: string;
    numPieces: number;
};

type ScrambleData = {
    numPieces: number;
};

@Common.MangaCSS(/^{origin}\/album\/\d+\//, 'h1#book-name')
@Common.MangasMultiPageCSS('div.row div.thumb-overlay-albums', Common.PatternLinkGenerator('/albums?page={page}'), 0, element => ({
    id: element.querySelector<HTMLAnchorElement>('a').pathname, title: element.querySelector<HTMLImageElement>('img').alt.trim()
}))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('18comic', '18comic', 'https://18comic.vip', Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'div.episode ul a', undefined, Common.AnchorInfoExtractor(false, 'span'));
        return chapters.length > 0 ? chapters : [new Chapter(this, manga, manga.Identifier.replace('/album/', '/photo/'), manga.Title)];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleData>[]> {
        const pages = await FetchWindowScript<PageData[]>(new Request(new URL(chapter.Identifier, this.URI)), pageScript, 1500);
        return pages.filter(page => page.url)
            .map(({ url, numPieces }) => new Page<ScrambleData>(this, chapter, new URL(url), { numPieces }));
    }

    public override async FetchImage(page: Page<ScrambleData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const numPieces = page.Parameters.numPieces;
        return numPieces === 0 ? blob : DeScramble(blob, async (image, ctx) => {
            const piecesHeight = image.height % numPieces;
            for (let index = 0; index < numPieces; index++) {
                let sourceHeight = Math.floor(image.height / numPieces);
                let destinationY = sourceHeight * index;
                const sourceY = image.height - sourceHeight * (index + 1) - piecesHeight;
                index == 0 ? sourceHeight += piecesHeight : destinationY += piecesHeight;
                ctx.drawImage(image, 0, sourceY, image.width, sourceHeight, 0, destinationY, image.width, sourceHeight);
            }
        });
    }
}