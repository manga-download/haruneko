import { Tags } from '../Tags';
import icon from './AdonisFansub.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    id: string,
    name: string
    chapters: APIChapter[]
}

type APIChapter = {
    id: string,
    title: string,
    number: string, //yes, its not a typo
    totalImage: number
}

type APIImage = {
    image : string
}
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = this.URI.origin + '/api/';
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
        const mangaId = url.match(this.mangaRegexp)[1];
        const mangaData = await this.GetMangaData(mangaId);
        return new Manga(this, provider, mangaId, mangaData.name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, '/manga', 'div#themes_outside__WCut6 a:not([id])');
        return mangas.map(manga => new Manga(this, provider, manga.Identifier.match(/\/manga\/([^/]+)/)[1], manga.Title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.GetMangaData(manga.Identifier);
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, [chapter.number, chapter.title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pageList: Page[] = [];
        const { name, chapters } = await this.GetMangaData(chapter.Parent.Identifier);
        const url = new URL(`/images/content/${name}/${chapter.Title}`, this.URI);
        const chapterItem = chapters.find(item => item.id === chapter.Identifier);
        for (let i = 1; i < chapterItem.totalImage; i++) {
            const page = new Page(this, chapter, url, { number: i.toString().padStart(4, '0') });
            pageList.push(page);
        }
        return pageList;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return await this.imageTaskPool.Add(async () => {

            const formdata = new FormData();
            formdata.append('path', decodeURI(page.Link.pathname));
            formdata.append('number', page.Parameters['number'] as string);

            const request = this.CreateRequest('dynamicImages', formdata);
            const { image } = await FetchJSON<APIImage>(request);

            return await (await fetch(image)).blob();
        }, priority, signal);
    }

    private async GetMangaData(identifier: string): Promise<APIManga> {
        const formdata = new FormData();
        formdata.append('id', identifier);
        return await FetchJSON<APIManga>(this.CreateRequest('selectedManga', formdata));
    }

    private CreateRequest(endpoint: string, formData: FormData): Request {
        return new Request(new URL(endpoint, this.apiUrl), {
            method: 'PUT',
            body: formData
        });
    }

}