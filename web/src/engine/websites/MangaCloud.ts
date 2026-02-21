import { Tags } from '../Tags';
import icon from './MangaCloud.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    id: string;
    title: string;
    chapters: APIChapter[];
};

type APIChapter = {
    id: string;
    name: string | null;
    number: number;
};

@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.natural img')].map(img => img.src);`, 750)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.mangacloud.org/comic/';

    public constructor() {
        super('mangacloud', 'MangaCloud', 'https://mangacloud.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { id, title } } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`./${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run ; page++) {
                const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`./browse`, this.apiUrl), {
                    method: 'POST',
                    body: JSON.stringify({ page }),
                    headers: {
                        'Content-type': 'application/json',
                    }
                }));
                const mangas = data.map(({ id, title }) => new Manga(this, provider, id, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`./${manga.Identifier}`, this.apiUrl)));
        return chapters.map(({ id, name, number }) => new Chapter(this, manga, `/comic/${manga.Identifier}/chapter/${ id }`, [number, name].filter(el=> el).join(' - ').trim()));
    }
}