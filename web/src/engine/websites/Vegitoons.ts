import { Tags } from '../Tags';
import icon from './Vegitoons.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    obr_id: number;
    obr_nome: string;
    obr_slug: string;
    capitulos: APIChapter[];
};

type APIChapter = {
    cap_id: number;
    cap_nome: string;
    cap_numero: number;
    cap_paginas: {
        path: string;
    }[];
};

type APIMangas = {
    obras: APIManga[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.vegitoons.black/';

    public constructor() {
        super('vegitoons', 'Vegitoons', 'https://vegitoons.black', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/obra/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { obr_id: id, obr_nome: name } = await FetchJSON<APIManga>(new Request(new URL(`./obras/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, `${id}`, name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { obras } = await FetchJSON<APIMangas>(new Request(new URL(`./obras/buscar?pagina=${page}&limite=100`, this.apiURL)));
                const mangas = obras.map(({ obr_id: id, obr_nome: name }) => new Manga(this, provider, `${id}`, name.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos } = await FetchJSON<APIManga>(new Request(new URL(`./obras/${manga.Identifier}`, this.apiURL)));
        return capitulos.reverse().map(({ cap_id: id, cap_nome: name }) => new Chapter(this, manga, `${id}`, name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { cap_paginas } = await FetchJSON<APIChapter>(new Request(new URL(`./capitulos/${chapter.Identifier}`, this.apiURL)));
        return cap_paginas.map(({ path }) => new Page(this, chapter, new URL(`https://cdn.vegitoons.black/${path}`)));
    }
}