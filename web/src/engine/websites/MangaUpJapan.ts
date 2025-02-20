import { Tags } from '../Tags';
import icon from './MangaUpJapan.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type JSONChapters = {
    id: number,
    name: string,
    subName: string
}[];

type JSONPages = {
    content: {
        value: {
            imageUrl: string,
        }
    }
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

    private ExtractNextJsPayloadData(element: HTMLScriptElement): string {
        const data = element.innerHTML.match(/^self\.__next_f\.push\(\[\d+,"(.*)"\]\)$/)?.at(1);
        return data?.replace(/\\{1,2}"/g, '"').replace(/\\{2,3}n/g, '\\n');
    }

    private async FetchNextJsData<T>(pathname: string, pattern: RegExp): Promise<T> {
        const request = new Request(new URL(pathname, this.URI));
        const elements = await FetchCSS<HTMLScriptElement>(request, 'script:not([src])');
        for (const element of elements) {
            const match = this.ExtractNextJsPayloadData(element)?.match(pattern);
            if (match) return JSON.parse(match.at(-1));
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchNextJsData<JSONChapters>(manga.Identifier, /"chapters":(\[{.*?}\]),/);
        return chapters.map(({ id, name, subName }) => new Chapter(this, manga, `${manga.Identifier}/chapters/${id}`, `${subName} ${name}`.replace(/\s+/g, ' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await this.FetchNextJsData<JSONPages>(chapter.Identifier, /(\[{"content":.*?}}}\]),/);
        return pages
            .map(page => page.content.value.imageUrl)
            .filter(imageUrl => imageUrl)
            .map(imageUrl => new Page(this, chapter, new URL(imageUrl)));
    }
}