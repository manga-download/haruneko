import { type Tag, Tags } from '../Tags';
import icon from './MangaFire.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APIResult<T> = {
    result: T,
    status: number
}

type APIHtml = {
    html: string
}

type APIPages = {
    images: [[string, number, number]]
}

type ChapterID = {
    itemid: string,
    itemtype: string,
    language: string
}

const chapterLanguageMap = new Map<string, Tag>([
    [ 'en', Tags.Language.English ],
    [ 'es', Tags.Language.Spanish ],
    [ 'es-la', Tags.Language.Spanish ],
    [ 'fr', Tags.Language.French ],
    [ 'ja', Tags.Language.Japanese ],
    [ 'pt-br', Tags.Language.Portuguese ],
]);

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.info h1[itemprop="name"]')
@Common.MangasMultiPageCSS('/az-list?page={page}', 'div.info > a', 1, 1, 250)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangafire', `MangaFire`, 'https://mangafire.to', Tags.Language.English, Tags.Language.French, Tags.Language.Japanese, Tags.Language.Portuguese, Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const id = manga.Identifier.split('.').pop();
        const request = new Request(new URL(manga.Identifier, this.URI));
        const data = await FetchCSS(request, 'section.m-list div.dropdown-menu a');
        const languageList = data.map(element => element.dataset.code.toLowerCase());

        const chapterList: Chapter[] = [];
        const types = [ 'chapter', 'volume' ];
        for (const language of languageList) {
            for (const type of types) {
                const uri = new URL(`ajax/read/${id}/${type}/${language}`, this.URI);
                const { result: { html } } = await FetchJSON<APIResult<APIHtml>>(new Request(uri));
                const dom = new DOMParser().parseFromString(html, 'text/html').body;
                const chapters = [ ...dom.querySelectorAll('a') ]
                    .filter(anchor => anchor.pathname.includes(`/${type}-`))
                    .map(anchor => {
                        const id = JSON.stringify({ itemid: anchor.dataset.id, itemtype: type, language });
                        const chapter = new Chapter(this, manga, id, `${ anchor.text.trim() } (${ language })`);
                        if(chapterLanguageMap.has(language)) {
                            chapter.Tags.Value.push(chapterLanguageMap.get(language));
                        }
                        return chapter;
                    });
                chapterList.push(...chapters);
            }
        }
        return chapterList.distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterid: ChapterID = JSON.parse(chapter.Identifier);
        const uri = new URL(`ajax/read/${chapterid.itemtype}/${chapterid.itemid}`, this.URI);
        const data = await FetchJSON<APIResult<APIPages>>(new Request(uri.href));
        return data.result.images.map(imageArray => {
            if (imageArray[2] < 1) {
                return new Page(this, chapter, new URL(imageArray[0]));
            }
            return new Page(this, chapter, new URL(imageArray[0]), { e: imageArray[2] });
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        return page.Parameters?.e ? DeScramble(data, (source, target) => Render(source, target, page.Parameters.e as number)) : data;
    }
}

async function Render(image: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D, e: number): Promise<void> {
    ctx.clearRect(0, 0, image.width, image.height);
    const f = 5;
    const s = Math.min(200, Math.ceil(image.width / f));
    const h = Math.min(200, Math.ceil(image.height / f));
    const W = Math.ceil(image.width / s) - 1;
    const d = Math.ceil(image.height / h) - 1;

    let x: number, l: number;
    for (let y = 0; y <= d; y++) {
        for (let m = 0; m <= W; m++) {
            x = m;
            l = y;
            if (m < W) {
                x = (W - m + e) % W;
            }
            if (y < d) {
                l = (d - y + e) % d;
            }

            ctx.drawImage(
                image,
                x * s,
                l * h,
                Math.min(s, image.width - m * s),
                Math.min(h, image.height - y * h),
                m * s,
                y * h,
                Math.min(s, image.width - m * s),
                Math.min(h, image.height - y * h)
            );
        }
    }
}