import { Tags } from '../Tags';
import icon from './MangasTop.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: number;
    titulo: string;
    capitulos: {
        id: number;
        numero: string;
    }[];
};

type APIPages = {
    imagens: {
        url: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/wp-json/mangastop/v1/`;

    public constructor() {
        super('mangastop', 'Mangas Top', 'https://mangastop.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/obra/\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, titulo } = await FetchJSON<APIManga>(new Request(new URL(`./obra/${url.match(/\/obra\/(\d+)/).at(1)}`, this.apiURL)));
        return new Manga(this, provider, `${id}`, titulo);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { mangas: mangasData } = await FetchJSON<{ mangas: APIManga[] }>(new Request(new URL(`./manga?pagina=${page}&por_pagina=50`, this.apiURL)));
                const mangas = mangasData.map(({ id, titulo }) => new Manga(this, provider, `${id}`, titulo));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos } = await FetchJSON<APIManga>(new Request(new URL(`./obra/${manga.Identifier}`, this.apiURL)));
        return capitulos.map(({ id, numero }) => new Chapter(this, manga, `${id}`, `Capítulo ${numero}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { imagens } = await FetchJSON<APIPages>(new Request(new URL(`./leitor/${chapter.Identifier}`, this.apiURL)));
        return imagens.map(({ url }) => new Page(this, chapter, new URL(url, this.URI), { Referer: this.URI.href }));
    }
}