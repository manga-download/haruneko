import { Tags } from '../Tags';
import icon from './Yurineko.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: number,
    originalName: string,
    chapters: APIChapter[]
}

type APIChapter = {
    id: number,
    name: string
}

@Common.PagesSinglePageJS('__NEXT_DATA__.props.pageProps.chapterData.url', 1000)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.yurineko.net';

    public constructor() {
        super('yurineko', 'Yurineko', 'https://yurineko.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = new URL(url).href.match(/manga\/([\d]+)/)[1];
        const request = new Request(new URL(`/manga/${mangaid}`, this.apiUrl).href);
        const data = await FetchJSON<APIManga>(request);
        return new Manga(this, provider, data.id.toString(), data.originalName.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL('/directory/general', this.apiUrl).href);
        const data = await FetchJSON<APIManga[]>(request);
        return data.map(manga => new Manga(this, provider, manga.id.toString(), manga.originalName.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/manga/${manga.Identifier}`, this.apiUrl).href);
        const data = await FetchJSON<APIManga>(request);
        return data.chapters.map(element => new Chapter(this, manga, `/read/${manga.Identifier}/${element.id}`, element.name.trim()));
    }
}