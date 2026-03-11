import { Tags } from '../Tags';
import icon from './BoyLoveCC.webp';
import { DecoratableMangaScraper, Manga, Page, type MangaPlugin, type Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type APIMangas = {
    code: number,
    result: {
        list: APIManga[]
    },
}

type APIManga = {
    id: number,
    title: string
}

type PageData = {
    images: string[],
    scrambled: boolean
}

type PageParameters = {
    scrambled: boolean
}

const chapterScript = `
    new Promise( resolve => {
        resolve ( [...document.querySelectorAll('li.chapter-btn a')].map(chapter => {
            return { id: chapter.pathname, title : chapter.text.trim()};
        }));
    });
`;

const pageScript = `
    new Promise( resolve => {
        const scrambled = firstMergeImg.toString().indexOf('do_mergeImg') > -1;
        const images =  [...document.querySelectorAll('div.reader-cartoon-image img.lazy')].filter(img => img.dataset.original );
        resolve({ scrambled, images : images.map (image => image.dataset.original)});
    });
`;

// TODO: Check for possible revision

@Common.MangaCSS(/^{origin}\/home\/book\/index\/id\/\d+$/, 'div.stui-content__detail div.title h1')
@Common.ChaptersSinglePageJS(chapterScript, 1500)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://boylove.cc/home/api/';

    public constructor() {
        super('boylovecc', 'Boylove.cc', 'https://boylove.cc', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { result: { list } } = await FetchJSON<APIMangas>(new Request(new URL(`./cate/tp/1-0-2-1-${page}-0-1-2`, this.apiUrl)));
                const mangas = list.map(item => new Manga(this, provider, `/home/book/index/id/${item.id}`, item.title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { images, scrambled } = await FetchWindowScript<PageData>(new Request(new URL(chapter.Identifier, this.URI)), pageScript);
        return images.map(page => new Page<PageParameters>(this, chapter, new URL(page), { scrambled }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters.scrambled ? blob : DeScramble(blob, async (image, ctx) => {
            for (let index = 1; index <= 13; index++) {
                if (image.height >= 4000) {
                    ctx.drawImage(image, Math.floor(image.width / 13) * (index - 1), 0, Math.floor(image.width / 13), image.height, Math.floor(image.width / 13) * (index - 1), 0, Math.floor(image.width / 13), image.height);
                } else if (index == 13) {
                    const pieceWidth = image.width - Math.floor(image.width / 13) * (13 - 1);
                    ctx.drawImage(image, 0, 0, pieceWidth, image.height, Math.floor(image.width / 13) * (13 - 1), 0, pieceWidth, image.height);
                } else {
                    const pieceWidth = Math.floor(image.width / 13);
                    ctx.drawImage(image, image.width - Math.floor(image.width / 13) * index, 0, pieceWidth, image.height, Math.floor(image.width / 13) * (index - 1), 0, pieceWidth, image.height);
                }
            }
        });
    }
}