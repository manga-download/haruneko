import { Tags } from '../Tags';
import icon from './MaidScan.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    obr_nome: string;
    obr_slug: string;
    capitulos: APIChapter[];
};

type APIMangas = { obras: APIManga[] };

type APIChapter = {
    cap_id: number;
    cap_nome: string;
};

@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.mx-auto img[alt^="Página"]')].map(img => img.src);`, 3000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = 'https://api2.empreguetes.wtf/';

    public constructor() {
        super('maidscan', 'Maid Scan', 'https://empreguetes.wtf', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/obras/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').at(-1);
        const { obr_nome: name } = await this.FetchAPI<APIManga>(`./obras/${slug}`);
        return new Manga(this, provider, slug, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { obras } = await this.FetchAPI<APIMangas>('./obras/search?pagina=1&limite=9999&todos_generos=1');
        return obras.map(({ obr_slug: slug, obr_nome: name }) => new Manga(this, provider, slug, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos } = await this.FetchAPI<APIManga>(`./obras/${manga.Identifier}`);
        return capitulos.reverse().map(({ cap_id: id, cap_nome: name }) => new Chapter(this, manga, `/capitulo/${id}`, name));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                'scan-id': '3'
            }
        }));
    }
}