import { Tags } from '../Tags';
import icon from './MangaUpJapan.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type JSONChapter = {
    id: number,
    name: string,
    subName: string
}

type JSONManga = {
    titleName: string,
    titleId: number,
    chapters: JSONChapter[]
}

type JSONImage = {
    imageUrl: string,
}

type JSONContent = {
    value: JSONImage
}

type JSONPage = {
    content: JSONContent
}

const mangasEndpoints = [
    '/mon',
    '/tue',
    '/wed',
    '/thu',
    '/fri',
    '/sat',
    '/sun',
    '/end',
    '/yomikiri'
].map(slug => `/series${slug}`);

function MangasExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname.match(new RegExpSafe('^/titles/(\\d+)$'))[1],
        title: element.querySelector('div.pc\\:text-title-md-pc').textContent.trim()
    };
}

@Common.MangasSinglePagesCSS(mangasEndpoints, 'a:has(div.pc\\:text-title-md-pc)', MangasExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('mangaupjapan', 'MangaUp (マンガアップ!)', 'https://www.manga-up.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon(): string {
        return icon;
    }

    private ExtractNextJsPayloadData(element: HTMLScriptElement): string {
        if (!element.innerHTML.includes('self.__next_f.push(')) {
            return undefined;
        }
        const data = element.innerHTML.match(/^self\.__next_f\.push\(\[\d+,"(.*)"\]\)$/)?.[1];
        return data?.replace(/\\{1,2}"/g, '"').replace(/\\{2,3}n/g, '\\n');
    }

    private async GetNextJsPayloadData(uri: URL, searchString: string): Promise<string> {
        const request = new Request(uri.href);
        const elements = await FetchCSS<HTMLScriptElement>(request, 'script');
        for (const element of elements) {
            const data = this.ExtractNextJsPayloadData(element);
            if (data && data.includes(searchString)) {
                return data;
            }
        }
        return undefined;
    }

    private async GetJSONManga(uri: URL): Promise<JSONManga> {
        const data = await this.GetNextJsPayloadData(uri, '"chapters":[');
        const jsonString = data.match(/,({"titleName":.*?}})\],/)[1];
        const mangaData: JSONManga = JSON.parse(jsonString);
        return mangaData;
    }

    private async GetJSONPages(uri: URL): Promise<JSONPage[]> {
        const data = await this.GetNextJsPayloadData(uri, '[{"content":');
        const jsonString = data.match(/(\[{"content":.*?}}}\]),/)[1];
        const imagesData: JSONPage[] = JSON.parse(jsonString);
        return imagesData;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/titles/\\d+(?:/chapters/\\d+)?$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const data = await this.GetJSONManga(new URL(url));
        return new Manga(this, provider, String(data.titleId), data.titleName);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/titles/${manga.Identifier}`, this.URI);
        const data = await this.GetJSONManga(uri);
        return data.chapters.map(chapter => new Chapter(this, manga, String(chapter.id), `${chapter.subName} ${chapter.name}`.trimStart()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`/titles/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, this.URI);
        const data = await this.GetJSONPages(uri);
        return data
            .map(page => page.content.value.imageUrl)
            .filter(imageUrl => imageUrl !== undefined && imageUrl !== '')
            .map(imageUrl => new Page(this, chapter, new URL(imageUrl)));
    }
}
