import { Tags } from '../Tags';
import icon from './MangaUpJapan.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type JSONChapter = {
    id: number,
    name: string,
    subName: string
}

type JSONPage = {
    content: {
        value: {
            imageUrl: string,
        }
    }
}

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
        title: element.querySelector<HTMLElement>('div.pc\\:text-title-md-pc').innerText
    };
}

@Common.MangaCSS(/^{origin}\/titles\/\d+$/, 'h2.pc\\:text-title-lg-pc')
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
        const elements = await FetchCSS<HTMLScriptElement>(new Request(uri.href), 'script:not([src])');
        for (const element of elements) {
            const data = this.ExtractNextJsPayloadData(element);
            if (data?.includes(scriptMatcher)) {
                return JSON.parse(data.match(dataRegexp).at(1)) as T;
            }
        }
        return undefined;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.ExtractJSONData<JSONChapter[]>(new URL(manga.Identifier, this.URI), '"chapters":[', /"chapters":(\[{.*?}\]),/);
        return chapters.map(({ id, name, subName }) => new Chapter(this, manga, `${manga.Identifier}/chapters/${id}`, `${subName} ${name}`.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await this.ExtractJSONData<JSONPage[]>(new URL(chapter.Identifier, this.URI), '[{"content":', /(\[{"content":.*?}}}\]),/);
        return pages
            .map(page => page.content.value.imageUrl)
            .filter(imageUrl => imageUrl)
            .map(imageUrl => new Page(this, chapter, new URL(imageUrl)));
    }
}
