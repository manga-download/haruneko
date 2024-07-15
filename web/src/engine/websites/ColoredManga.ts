import { Tags } from '../Tags';
import icon from './ColoredManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    name: string
    chapters: APIChapter[]
}

type APIChapter = {
    id: string,
    title: string,
    number: string,
    totalImage: number
}

type APIImage = {
    image : string
}
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/`;
    private readonly mangaRegexp = new RegExp(`^${this.URI.origin}/manga/([^/]+)$`);

    public constructor() {
        super('coloredmanga', 'Colored Manga', 'https://coloredmanga.net', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaSlug = url.match(this.mangaRegexp)[1];
        const mangaData = await this.GetMangaData(mangaSlug);
        return new Manga(this, provider, mangaSlug, mangaData.name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, '/manga', 'div#themes_outside__WCut6 a:not([id])');
        return mangas.map(manga => new Manga(this, provider, manga.Identifier.match(/\/manga\/([^/]+)/)[1], manga.Title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.GetMangaData(manga.Identifier);
        return chapters.map(chapter => {
            const title = [
                chapter.number,
                chapter.title ? '-' : '',
                chapter.title,
            ].join(' ').trim();
            return new Chapter(this, manga, chapter.id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { name, chapters } = await this.GetMangaData(chapter.Parent.Identifier);
        const url = new URL(`/images/content/${name}/${chapter.Title}`, this.URI);
        const { totalImage } = chapters.find(item => item.id === chapter.Identifier);
        return new Array(totalImage).fill(0).map((_, index) => new Page(this, chapter, this.URI, { path: url.pathname, number: (index+1).toString().padStart(4, '0') }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return await this.imageTaskPool.Add(async () => {

            const formdata = new FormData();
            formdata.append('path', decodeURI(page.Parameters['path'] as string));
            formdata.append('number', page.Parameters['number'] as string);

            const request = this.CreateRequest('dynamicImages', formdata);
            const { image } = await FetchJSON<APIImage>(request);

            const response = await fetch(image);//turn base64image into response
            return Common.GetTypedData(await response.arrayBuffer());

        }, priority, signal);
    }

    private async GetMangaData(mangaSlug: string): Promise<APIManga> {
        const formdata = new FormData();
        formdata.append('id', mangaSlug);
        return await FetchJSON<APIManga>(this.CreateRequest('selectedManga', formdata));
    }

    private CreateRequest(endpoint: string, formData: FormData): Request {
        return new Request(new URL(endpoint, this.apiUrl), {
            method: 'PUT',
            body: formData
        });
    }

}