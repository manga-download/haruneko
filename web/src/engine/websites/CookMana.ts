import { Tags } from '../Tags';
import icon from './CookMana.webp';
import { Chapter, DecoratableMangaScraper, Page, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIMedia = {
    id: string;
    title: string;
};

type APIPages = {
    folder3: string;
    urls: string;
};

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, 'div.detail-mana div.dt-ma-img div.dt-left-tt h1', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.textContent.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://cookmana.com/api/';
    private readonly CDNv2 = 'https://www.pl3040.com/';

    public constructor() {
        super('cookmana', 'CookMana', 'https://cookmana.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Korean, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIMedia[]>>(new Request(new URL('./lastest/list?page=1&type=0&pageSize=9999', this.apiUrl)));
        return data.map(({ id, title }) => new Manga(this, provider, id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIResult<APIMedia[]>>(new Request(new URL(`./episode/list/${manga.Identifier}?page=1&order=desc&pageSize=9999`, this.apiUrl)));
        return data.map(({ id, title }) => new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { urls, folder3 } } = await FetchJSON<APIResult<APIPages>>(new Request(new URL(`./detail/${chapter.Identifier}`, this.apiUrl)));
        return urls.split(',')?.map(page => new Page(this, chapter, new URL(`${this.CDNv2}kr/${folder3}/${page.split('/').at(-1)}`))) ?? [];
    }
}