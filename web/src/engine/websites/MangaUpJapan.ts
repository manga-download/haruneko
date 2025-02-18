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

type JSONPage = {
    content: {
        value: {
            imageUrl: string,
        }
    }
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
        id: element.pathname.match(new RegExpSafe('^/titles/(\\d+)$')).at(1),
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
        const data = element.innerHTML.match(/^self\.__next_f\.push\(\[\d+,"(.*)"\]\)$/)?.at(1);
        return data?.replace(/\\{1,2}"/g, '"').replace(/\\{2,3}n/g, '\\n');
    }

    private async ExtractJSONData<T>(uri: URL, scriptMatcher: string, dataRegexp: RegExp): Promise<T> {
        const request = new Request(uri.href);
        const elements = await FetchCSS<HTMLScriptElement>(request, 'script:not([src])');
        for (const element of elements) {
            if (!element.innerHTML.includes('self.__next_f.push(')) {
                continue;
            }
            const data = this.ExtractNextJsPayloadData(element);
            if (data && data.includes(scriptMatcher)) {
                const jsonString = data.match(dataRegexp).at(1);
                return JSON.parse(jsonString) as T;
            }
        }
        return undefined;
    }

    private async GetJSONManga(uri: URL): Promise<JSONManga> {
        return await this.ExtractJSONData<JSONManga>(uri, '"chapters":[', /,({"titleName":.*?}})\],/);
    }

    private async GetJSONPages(uri: URL): Promise<JSONPage[]> {
        return await this.ExtractJSONData<JSONPage[]>(uri, '[{"content":', /(\[{"content":.*?}}}\]),/);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/titles/\\d+(?:/chapters/\\d+)?$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { titleName, titleId } = await this.GetJSONManga(new URL(url));
        return new Manga(this, provider, titleId.toString(), titleName);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.GetJSONManga(new URL(`/titles/${manga.Identifier}`, this.URI));
        return chapters.map(({ id, name, subName }) => new Chapter(this, manga, id.toString(), `${subName} ${name}`.trimStart()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await this.GetJSONPages(new URL(`/titles/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, this.URI));
        return pages
            .map(page => page.content.value.imageUrl)
            .filter(imageUrl => imageUrl)
            .map(imageUrl => new Page(this, chapter, new URL(imageUrl)));
    }
}
