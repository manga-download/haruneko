import { type Tag, Tags } from '../Tags';
import icon from './MangaFire.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APIResult<T> = {
    result: T,
};

type APIChapters = APIResult<{
    html: string;
}>;

type APIPages = APIResult<{
    images: [ [ string, never, number ] ];
}>;

type ChapterID = {
    itemid: string,
    itemtype: string,
    language: string;
};

type PageParameters = {
    blockScramblingOffset?: number;
};

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

    public constructor () {
        super('mangafire', `MangaFire`, 'https://mangafire.to', Tags.Language.English, Tags.Language.French, Tags.Language.Japanese, Tags.Language.Portuguese, Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const id = manga.Identifier.split('.').at(-1);
        const data = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'section.m-list div.dropdown-menu a');
        const languageList = data.map(element => element.dataset.code.toLowerCase());

        const chapterList: Chapter[] = [];
        const types = [ 'chapter', 'volume' ];
        for (const language of languageList) {
            for (const type of types) {
                const { result: { html } } = await FetchJSON<APIChapters>(this.PrepareRequest(new URL(`./ajax/read/${id}/${type}/${language}`, this.URI)));
                const dom = new DOMParser().parseFromString(html, 'text/html').body;
                const chapters = [ ...dom.querySelectorAll('a') ]
                    .filter(anchor => anchor.pathname.includes(`/${type}-`))
                    .map(anchor => {
                        const id = JSON.stringify({ itemid: anchor.dataset.id, itemtype: type, language });
                        return new Chapter(this, manga, id, `${anchor.text.trim()} (${language})`,
                            ...chapterLanguageMap.has(language) ? [ chapterLanguageMap.get(language) ] : []
                        );
                    });
                chapterList.push(...chapters);
            }
        }
        return chapterList.distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const chapterid: ChapterID = JSON.parse(chapter.Identifier);
        const { result: { images } } = await FetchJSON<APIPages>(this.PrepareRequest(new URL(`./ajax/read/${chapterid.itemtype}/${chapterid.itemid}`, this.URI)));
        return images.map(([ url, _, offset ]) => new Page<PageParameters>(this, chapter, new URL(url), { Referer: this.URI.href, blockScramblingOffset: offset }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return page.Parameters?.blockScramblingOffset > 0 ? DeScramble(blob, (source, target) => Render(source, target, page.Parameters.blockScramblingOffset)) : blob;
    }

    private PrepareRequest(endpoint: URL): Request {
        return new Request(endpoint, {
            headers: {
                'Referer': this.URI.href,
                'X-Requested-With': 'XMLHttpRequest',
            }
        });
    }
}

async function Render(image: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D, blockScramblingOffset: number): Promise<void> {
    ctx.clearRect(0, 0, image.width, image.height);
    const blockCount = 5;
    const blockWidth = Math.min(200, Math.ceil(image.width / blockCount));
    const blockHeight = Math.min(200, Math.ceil(image.height / blockCount));
    const blockRowCount = Math.ceil(image.width / blockWidth) - 1;
    const blockColumnCount = Math.ceil(image.height / blockHeight) - 1;

    for (let targetBlockColumn = 0, sourceBlockColumn = 0; targetBlockColumn <= blockColumnCount; targetBlockColumn++) {
        for (let targetBlockRow = 0, sourceBlockRow = 0; targetBlockRow <= blockRowCount; targetBlockRow++) {
            sourceBlockRow = targetBlockRow;
            sourceBlockColumn = targetBlockColumn;
            if (targetBlockRow < blockRowCount) {
                sourceBlockRow = (blockRowCount - targetBlockRow + blockScramblingOffset) % blockRowCount;
            }
            if (targetBlockColumn < blockColumnCount) {
                sourceBlockColumn = (blockColumnCount - targetBlockColumn + blockScramblingOffset) % blockColumnCount;
            }

            ctx.drawImage(
                image,
                sourceBlockRow * blockWidth,
                sourceBlockColumn * blockHeight,
                Math.min(blockWidth, image.width - targetBlockRow * blockWidth),
                Math.min(blockHeight, image.height - targetBlockColumn * blockHeight),
                targetBlockRow * blockWidth,
                targetBlockColumn * blockHeight,
                Math.min(blockWidth, image.width - targetBlockRow * blockWidth),
                Math.min(blockHeight, image.height - targetBlockColumn * blockHeight)
            );
        }
    }
}