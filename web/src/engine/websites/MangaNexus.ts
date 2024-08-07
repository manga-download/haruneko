import { Tags } from '../Tags';
import icon from './MangaNexus.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type JSONMangas = {
    pageProps: {
        mangas: {
            items: APIManga[]
        }
    }
}

type JSONManga = {
    pageProps: {
        manga: APIManga,
        chapters: APIChapter[]
    }
}

type JSONChapter = {
    pageProps: {
        manga: APIManga,
        chapter: APIChapter
    }
}

type APIManga = {
    id: string,
    name: string,
    slug : string
}

type APIChapter = {
    id: string,
    number: string,
    slug: string,
    name: string,
    mangaId: string,
    pages : string[],
}

type NEXTDATA = {
    buildId: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private nextBuild = '';

    public constructor() {
        super('manganexus', `MangaNexus`, 'https://manganexus.net', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new Request(this.URI.href);
        const data = await FetchWindowScript<NEXTDATA>(request, `__NEXT_DATA__`, 2000);
        this.nextBuild = data.buildId;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url : string): Promise<Manga> {
        const slug = url.split('/').pop();
        const jsonUrl = new URL(`/_next/data/${ this.nextBuild }/manga/${ slug }.json?slug=${ slug }`, this.URI).href;
        const request = new Request(jsonUrl);
        const data = await FetchJSON<JSONManga>(request);
        return new Manga(this, provider, slug, data.pageProps.manga.name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin) : Promise<Manga[]> {
        const mangalist = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        try {
            const url = new URL(`/_next/data/${this.nextBuild}/lista-de-mangas.json?p=${page}`, this.URI).href;
            const request = new Request(url);
            const { pageProps: { mangas: { items } } } = await FetchJSON<JSONMangas>(request);
            return items.map(item => new Manga(this, provider, item.slug, item.name.trim()));
        } catch { // TODO: Do not return empty list for generic errors
            return [];
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = manga.Identifier;
        const url = new URL(`/_next/data/${this.nextBuild}/manga/${ slug }.json?slug=${ slug }`, this.URI).href;
        const request = new Request(url);
        const data = await FetchJSON<JSONManga>(request);
        return data.pageProps.chapters.map(chap => {
            const title = `Capítulo ${chap.number}${chap.name.length != 0 ? ' - ' + chap.name : ''}`;
            return new Chapter(this, manga, chap.slug, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaSlug = chapter.Parent.Identifier;
        const url = new URL(`/_next/data/${this.nextBuild}/manga/${mangaSlug}/capitulo/${ chapter.Identifier}.json`, this.URI).href;
        const request = new Request(url);
        const data = await FetchJSON<JSONChapter>(request);
        return data.pageProps.chapter.pages.map(page => new Page(this, chapter, new URL(page)));
    }
}