import { Tags } from '../Tags';
import icon from './MangaLib.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type ImageServers = {
    imageServers: ImageServer[]
}

type ImageServer = {
    id: string,
    url: string,
    site_ids: number[]
}

type APIResult<T> = {
    data: T,
    meta: {
        has_next_page: boolean,
    }
}

type APIManga = {
    id: number,
    rus_name: string,
    slug_url: string
}

type APIChapter = {
    volume: string,
    number: string,
    name: string,
    branches_count: number,
    branches: {
        id: number,
        branch_id: number | null,
        teams: {
            name: string
        }[]
    }[]
}

type APIPages = {
    pages: {
        url: string
    }[]
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.mangalib.me/api/';
    private readonly siteId = 1;
    private imageServerURL: string = undefined;

    public constructor() {
        super('mangalib', 'MangaLib', 'https://mangalib.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const { data: { imageServers } } = await FetchJSON<APIResult<ImageServers>>(new Request(new URL('./constants?fields[]=imageServers', this.apiUrl)));
        this.imageServerURL = imageServers.find(server => server.id === 'main' && server.site_ids.includes(this.siteId)).url;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/ru/manga/[^/]`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaSlug = new URL(url).pathname.split('/').at(-1);
        const { data: { slug_url, rus_name } } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`./manga/${mangaSlug}`, this.apiUrl)));
        return new Manga(this, provider, slug_url, rus_name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1; true; page++) {
            const url = new URL(`./manga?page=${page}&site_id[]=${this.siteId}`, this.apiUrl);
            await Delay(500);
            const { data, meta: { has_next_page } } = await FetchJSON<APIResult<APIManga[]>>(new Request(url));
            mangaList.push(...data.map(manga => new Manga(this, provider, manga.slug_url, manga.rus_name.trim())));
            if (!has_next_page) break;
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`./manga/${manga.Identifier}/chapters`, this.apiUrl)));
        return data.reduce((accumulator: Chapter[], chapter) => {
            let baseTitle = `Том ${chapter.volume} Глава ${chapter.number}`;
            baseTitle += chapter.name ? ` - ${chapter.name}` : '';
            const chapters = chapter.branches.map(branch => {
                const teamName = chapter.branches_count > 1 ? `[${branch.teams.at(0).name}]` : '';
                const chapterURL = new URL(`./manga/${manga.Identifier}/chapter?number=${chapter.number}&volume=${chapter.volume}`, this.apiUrl);
                if (branch.branch_id) chapterURL.searchParams.set('branch_id', branch.branch_id.toString());
                return new Chapter(this, manga, chapterURL.pathname + chapterURL.search, [baseTitle, teamName].join(' ').trim());
            });
            accumulator.push(...chapters);
            return accumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(chapter.Identifier, this.apiUrl);
        const { data: { pages } } = await FetchJSON<APIResult<APIPages>>(new Request(url));
        return pages.map(page => new Page(this, chapter, new URL(this.imageServerURL + page.url)));
    }
}
