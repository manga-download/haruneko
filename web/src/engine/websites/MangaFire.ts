import { Tags } from '../Tags';
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

const chapterLanguageMap = {
    en: Tags.Language.English,
    fr: Tags.Language.French,
    ja: Tags.Language.Japanese,
    'pt-br': Tags.Language.Portuguese,
    es: Tags.Language.Spanish,
    'es-la': Tags.Language.Spanish,

};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.info h1[itemprop="name"]')
@Common.MangasMultiPageCSS('/az-list?page={page}', 'div.info > a', 1, 1, 250)

export default class extends DecoratableMangaScraper {
    private readonly idRegex = /manga\/[^.]+\.(\w+)/;

    public constructor() {
        super('mangafire', `MangaFire`, 'https://mangafire.to', Tags.Language.English, Tags.Language.French, Tags.Language.Japanese, Tags.Language.Portuguese, Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        //fetch page to get languages available
        const id = manga.Identifier.match(this.idRegex)[1];
        const mangauri = new URL(manga.Identifier, this.URI);
        const data = await FetchCSS(new Request(mangauri.href), 'section.m-list div.dropdown-menu a');
        let languageList = data.map(element => element.dataset.code.toLowerCase());
        languageList = [...new Set(languageList)];

        const chapterList: Chapter[] = [];
        const types = ['chapter', 'volume'];
        for (const language of languageList) {
            for (const type of types) { // https://mangafire.to/ajax/read/XXXXX/volume/en
                const uri = new URL(`ajax/read/${id}/${type}/${language}`, this.URI);
                const data = await FetchJSON<APIResult<APIHtml>>(new Request(uri.href));
                const dom = new DOMParser().parseFromString(data.result.html, 'text/html');
                const chaptersNodes = [...dom.querySelectorAll('a')];
                chaptersNodes.filter(anchor => anchor.pathname.includes(`/${type}-`))
                    .forEach(chapter => {
                        const id = JSON.stringify({ itemid: chapter.dataset.id, itemtype: type, language: language });
                        const title = chapter.text.trim();
                        const newChapter = new Chapter(this, manga, id, title);
                        try {
                            newChapter.Tags.push(chapterLanguageMap[language]);
                        } catch (error) {
                            //console.warn('Unable to find language')
                        }
                        chapterList.push(newChapter);
                    });
            }
        }
        return chapterList;

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //https://mangafire.to/ajax/read/volume/11111  /  https://mangafire.to/ajax/read/chapter/123456
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
        return !page.Parameters?.e ? data : DeScramble(data, async (image, ctx) => {

            ctx.clearRect(0, 0, image.width, image.height);
            const e = page.Parameters.e as number;
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

        });

    }
}