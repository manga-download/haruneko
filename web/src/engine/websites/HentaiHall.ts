import { Tags } from '../Tags';
import icon from './HentaiHall.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, type Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    _id: string;
    nombre: string;
    img: string[];
};

@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://hentaihallbackend-production.up.railway.app/manhwa/';

    public constructor() {
        super('hentaihall', 'HentaiHall', 'https://hentaihall.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { _id, nombre } = await FetchJSON<APIManga>(new Request(new URL(`./see/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, _id, nombre);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`./library?page=${page}`, this.apiUrl)));
                const mangas = data.map(({ _id, nombre }) => new Manga(this, provider, _id, nombre));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { img } = await FetchJSON<APIManga>(new Request(new URL(`./see/${chapter.Identifier}`, this.apiUrl)));
        return img.map(img => new Page(this, chapter, new URL(img)));
    }
}