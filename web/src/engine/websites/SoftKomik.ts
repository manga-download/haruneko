import { Tags } from '../Tags';
import icon from './SoftKomik.webp';
import * as Common from './decorators/Common';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIMangaDetails = {
    pageProps: {
        data: {
            DataKomik: APIManga,
            DataChapter : APIChapter[]
        }
    }
}

type APIManga = {
    title: string,
    title_slug: string
}

type APIChapter = {
    chapter: string
}

type APIPages = {
    pageProps: {
        data: {
            imgSrc: string[]
        }
    }
}

type APIMangas = {
    pageProps: {
        data: {
            data: APIManga[]
        }
    }
}
export default class extends DecoratableMangaScraper {

    private nextBuild = '';
    private readonly CDN = ['https://soft1.softdevices.my.id', 'https://soft2.b-cdn.net'];
    public constructor() {
        super('softkomik', `Softkomik`, 'https://softkomik.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new Request(this.URI.href);
        this.nextBuild = await FetchWindowScript<string>(request, `__NEXT_DATA__.buildId`, 5000);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').pop();
        const uri = new URL(`/_next/data/${this.nextBuild}/${slug}.json`, this.URI).href;
        const request = new Request(uri);
        const { pageProps: { data: { DataKomik } } } = await FetchJSON<APIMangaDetails>(request);
        return new Manga(this, provider, DataKomik.title_slug, DataKomik.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList.distinct();
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL(`/_next/data/${this.nextBuild}/komik/list.json?page=${page}`, this.URI).href;
        const request = new Request(url);
        const { pageProps: { data: { data } } } = await FetchJSON<APIMangas>(request);
        return data.map(manga => new Manga(this, provider, manga.title_slug, manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(`/_next/data/${this.nextBuild}/${manga.Identifier}.json`, this.URI).href;
        const request = new Request(url);
        const { pageProps: { data: { DataChapter } } } = await FetchJSON<APIMangaDetails>(request);
        return DataChapter.map(chapter => new Chapter(this, manga, chapter.chapter, chapter.chapter));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`/_next/data/${this.nextBuild}/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}.json`, this.URI).href;
        const request = new Request(url);
        const { pageProps: { data: { imgSrc } } } = await FetchJSON<APIPages>(request);
        return imgSrc.map(page => new Page(this, chapter, new URL(page, this.CDN[0]), { alternativeUrl: new URL(page, this.CDN[1]).href}));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        if (!blob.type.startsWith('image')) {
            const fakepage = new Page(this, page.Parent as Chapter, new URL(page.Parameters.alternativeUrl as string));
            return Common.FetchImageAjax.call(this, fakepage, priority, signal, true);
        }
        return blob;
    }

}