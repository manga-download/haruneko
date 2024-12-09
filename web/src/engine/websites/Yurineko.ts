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

const pageScript = `__NEXT_DATA__.props.pageProps.chapterData.url.map(image => new URL(image, 'https://storage.yurineko.my/').href);`;

@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.yurineko.my';

    public constructor() {
        super('yurineko', 'Yurineko', 'https://yurineko.my', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = new URL(url).href.match(/manga\/([\d]+)/)[1];
        const { id, originalName } = await FetchJSON<APIManga>(new Request(new URL(`/manga/${mangaid}`, this.apiUrl)));
        return new Manga(this, provider, id.toString(), originalName.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchJSON<APIManga[]>(new Request(new URL('/directory/general', this.apiUrl)));
        return data.map(manga => new Manga(this, provider, manga.id.toString(), manga.originalName.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`/manga/${manga.Identifier}`, this.apiUrl)));
        return chapters.map(element => new Chapter(this, manga, `/read/${manga.Identifier}/${element.id}`, element.name.trim()));
    }
}