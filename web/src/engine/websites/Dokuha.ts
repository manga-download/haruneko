import { Tags } from '../Tags';
import icon from './SinensisScan.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type JSONImage = {
    img: string,
    rectSrc: string
}

type DecryptingData = {
    size: number,
    decodeRecipes: {
        before: number,
        after: number
    }[]
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('div.figure-title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/comicweb\/contents\/comic\/[^/]+$/, 'div.comic-navigation h1.comic-name', Common.ElementLabelExtractor('span'))
@Common.MangasMultiPageCSS('/comicweb/category/general/list?page={page}', 'div#list-row div.list-comic-info dt.title a')
@Common.ChaptersSinglePageCSS('section.comic-list ul a', ChapterExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dokuha', 'マンガ読破！EX (Dokuha)', 'https://dokuha.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images: JSONImage[] = await FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI)), 'images', 2500);
        return images.filter(image => image).map(image => new Page(this, chapter, new URL(image.img), { scrambleJSONUrl: image.rectSrc }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const data = new Uint8Array(await blob.arrayBuffer());
        const decrypted = await this.DecryptPicture(data, page.Parameters['scrambleJSONUrl'] as string);
        return Common.GetTypedData(decrypted);
    }

    private async DecryptPicture(data: Uint8Array, jsonUrl: string): Promise<ArrayBuffer> {
        const BYTE_BLOCK = 2000;
        const loadBins = [];

        for (let i = 0; i < data.length; i += BYTE_BLOCK) {
            const chunk = data.slice(i, i + BYTE_BLOCK);
            loadBins.push(chunk);
        }

        const { decodeRecipes, size } = await FetchJSON<DecryptingData>(new Request(jsonUrl));
        const result = [];
        for (const recipe of decodeRecipes) {
            result[recipe.before] = loadBins[recipe.after];
        }

        return await new Blob(result).slice(0, size).arrayBuffer();
    }

}