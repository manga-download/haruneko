import { Tags } from '../Tags';
import icon from './ShadowMangas.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { Priority, TaskPool } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';

type APIManga = {
    publicId: string;
    titulo: string;
};

type APIChapter = {
    publicId: string;
    numeroCapitulo: number;
    titulo: string;
}

type APIPages = {
    paginas: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://shademanga.com/api/';
    private readonly interactionTaskPool = new TaskPool(1, RateLimit.PerMinute(30));

    public constructor() {
        super('shadowmangas', 'ShadowMangas', 'https://shademanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/serie/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { publicId, titulo } = await FetchJSON<APIManga>(new Request(new URL(`./series-locales/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, publicId, titulo);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page += 1) {
            const mangasData = await this.interactionTaskPool.Add(async () => FetchJSON<APIManga[]>(new Request(new URL(`./series-locales/?page=${page}&pageSize=100`, this.apiURL))), Priority.Low);
            const mangas = mangasData.map(({ publicId, titulo }) => new Manga(this, provider, publicId, titulo));
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchJSON<APIChapter[]>(new Request(new URL(`./series-locales/${manga.Identifier}/capitulos?todos=true`, this.apiURL)));
        return chapters.reverse().map(({ publicId, titulo, numeroCapitulo }) => new Chapter(this, manga, publicId, ['Cap.', numeroCapitulo, titulo].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { paginas } = await FetchJSON<APIPages>(new Request(new URL(`./series-locales/${chapter.Parent.Identifier}/capitulos/${chapter.Identifier}/paginas`, this.apiURL)));
        return paginas.map(page => new Page(this, chapter, new URL(page)));
    }
}