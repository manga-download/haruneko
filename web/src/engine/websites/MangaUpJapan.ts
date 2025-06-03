import { Tags } from '../Tags';
import icon from './MangaUpJapan.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedChapterData = {
    id: number,
    name: string,
    subName: string,
}[];

type HydratedPageData = {
    content: { value: { imageUrl?: string } }
}[];

const mangasEndpoints = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
    'end',
    'yomikiri'
].map(slug => `/series/${slug}`);

function MangasExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector<HTMLElement>('div[class*="text-title-md"]').innerText
    };
}

@Common.MangaCSS(/^{origin}\/titles\/\d+$/, 'h2[class*="text-title-lg"]')
@Common.MangasSinglePagesCSS(mangasEndpoints, 'a:has(div[class*="text-title-md"])', MangasExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaupjapan', 'MangaUp (マンガアップ!)', 'https://www.manga-up.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon(): string {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.URI));
        const data = await FetchNextJS(request, data => this.ExtractValue(data, 'chapters'));
        const entries = this.ExtractValue<HydratedChapterData>(data, 'chapters');
        return entries.map(({ id, name, subName }) => new Chapter(this, manga, `${manga.Identifier}/chapters/${id}`, `${subName} ${name}`.replace(/\s+/g, ' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI));
        const data = await FetchNextJS(request, data => this.ExtractValue(data, 'pages'));
        const entries = this.ExtractValue<HydratedPageData>(data, 'pages');
        return entries
            .filter(page => page.content.value.imageUrl)
            .map(page => new Page(this, chapter, new URL(page.content.value.imageUrl, this.URI)));
    }

    /**
     * Scans the the given {@link data} object recursively searching for the first occurence of the given {@link key}
     * and returns the corresponding value, or `undefined` if non was found.
     */
    private ExtractValue<T extends JSONElement>(data: JSONElement, key: string | number): T {
        if(data && typeof data === 'object') {
            if(key in data) return data[key];
            for(const value of Object.values(data)) {
                const result = this.ExtractValue<T>(value, key);
                if(result) return result;
            }
        }
        return undefined;
    }
}