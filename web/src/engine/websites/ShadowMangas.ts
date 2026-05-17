import { Tags } from '../Tags';
import icon from './ShadowMangas.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: number;
    titulo: string;
    capitulos: APIChapter[];
};

type APIChapter = {
    id: number;
    numeroCapitulo: number;
    titulo: string;
};

type APIPages = {
    paginas: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://shademanga.com/api/';

    public constructor() {
        super('shadowmangas', 'ShadowMangas', 'https://shademanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/serie/local/\\d+/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, titulo } = await FetchJSON<APIManga>(new Request(new URL(`./series-locales/${url.split('/').filter(Boolean).at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, `${id}`, titulo);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIManga[]>(new Request(new URL('./series-locales/?page=1&pageSize=99999', this.apiUrl)));
        return mangas.map(({ id, titulo }) => new Manga(this, provider, `${id}`, titulo));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos } = await FetchJSON<APIManga>(new Request(new URL(`./series-locales/${manga.Identifier}`, this.apiUrl)));
        return capitulos.reverse().map(({ id, titulo, numeroCapitulo }) => new Chapter(this, manga, `${id}`, [`Cap. ${numeroCapitulo}`, titulo].filter(Boolean).join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { paginas } = await FetchJSON<APIPages>(new Request(new URL(`./series-locales/${chapter.Parent.Identifier}/capitulos/${chapter.Identifier}/paginas`, this.apiUrl)));
        return paginas.map(page => new Page(this, chapter, new URL(page)));
    }
}