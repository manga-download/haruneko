import { Tags } from '../Tags';
import icon from './OkToon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIResult<T> = {
    result: {
        data: {
            json: T
        }
    }
}[]

type APIManga = {
    id: string,
    title: string
}

type APIChapters = {
    toonId: string,
    id: string,
    title : string
}[]

type JSONEpisode = {
    pageProps: {
        episode: {
            files: {
                url: string
            }[]
        }
    }
}

type JSONManga = {
    pageProps: {
        trpcState: {
            json: {
                queries: {
                    '0': {
                        state: {
                            data: APIManga
                        }
                    }
                }
            }
        }
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.oktoon.com/trpc/';
    private nextBuild = '67BC1LNj5mBw5tJfo56dQ';

    public constructor() {
        super('oktoon', `OkToon`, 'https://oktoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.nextBuild = await FetchWindowScript(new Request(new URL(this.URI)), `__NEXT_DATA__.buildId`, 2500) ?? this.nextBuild;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/webtoon/content/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, _url: string): Promise<Manga> {
        const slug = _url.split('/').at(-1);
        const data = await FetchJSON<JSONManga>(new Request(new URL(`/_next/data/${this.nextBuild}/webtoon/content/${slug}.json?slug=${slug}`, this.URI)));
        const { id, title } = data.pageProps.trpcState.json.queries['0'].state.data;
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const parameters = {
            '0': {
                json: {
                    type: 'weekly',
                    category: 'general',
                    orderBy: 'update',
                    publishPeriod: null,
                    isAdult: true,
                    limit: 100,
                    cursor: page * 100
                }
            }
        };
        const endpoint = new URL('toon.toons?batch=1', this.apiUrl);
        endpoint.searchParams.set('input', JSON.stringify(parameters));
        const [{ result: { data: { json } } }] = await FetchJSON<APIResult<APIManga[]>>(new Request(endpoint));
        return json.map(manga => new Manga(this, provider, manga.id, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const parameters = {
            '0': {
                json:
                {
                    toonId: manga.Identifier
                }
            }
        };
        const endpoint = new URL('episode.episodes?batch=1', this.apiUrl);
        endpoint.searchParams.set('input', JSON.stringify(parameters));
        const [{ result: { data: { json } } }] = await FetchJSON<APIResult<APIChapters>>(new Request(endpoint));
        return json.map(chapter => new Chapter(this, manga, chapter.id, chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pageProps: { episode: { files } } } = await FetchJSON<JSONEpisode>(new Request(new URL(`/_next/data/${this.nextBuild}/webtoon/content/${chapter.Parent.Identifier}/view/${chapter.Identifier}.json`, this.URI)));
        return files.map(page => new Page(this, chapter, new URL(page.url)));
    }
}