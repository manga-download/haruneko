import { Tags } from '../Tags';
import icon from './StarboundScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = Array<{
    id: string,
    title: string,
}>

type APIChapters = Array<{
    chapters: {
        id: string,
        number: number
    }[]
}>

type APIPages = Array<{
    pages: {
        id: string,
        image_url: string
    }[]
}>

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://ayomxspoosbrsldbbptc.supabase.co/rest/v1/';
    private readonly cdnUrl = 'https://ayomxspoosbrsldbbptc.supabase.co/storage/v1/object/public/webtoon-images/';
    private readonly key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5b214c3Bvb3NicnNsZGJicHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDUwOTYsImV4cCI6MjA2MTc4MTA5Nn0.eHEJnJgzeZkxzCAfIHXg1tYUYk8spWiMamybyVk6FfQ';
    private readonly apiHeaders = new Headers({
        Authorization: `Bearer ${this.key}`,
        Apikey: this.key,
        'X-Client-Info': 'supabase-js-web/2.49.4',
    });

    public constructor() {
        super('starboundscans', 'Starbound Scans', 'https://starboundscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/webtoon/[^/]+$`).test(url);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await this.FetchAPI<APIMangas>('./webtoons?select=id,title');
        return mangas.map(manga => new Manga(this, provider, manga.id, manga.title));
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaID = url.split('/').at(-1);
        const [{ id, title }] = await this.FetchAPI<APIMangas>(`./webtoons?select=id,title&id=eq.${mangaID}`);
        return new Manga(this, provider, id, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [{ chapters }] = await this.FetchAPI<APIChapters>(`./webtoons?select=chapters(id,number)&id=eq.${manga.Identifier}`);
        return chapters.sort((a, b) => a.number - b.number)
            .map(chapter => new Chapter(this, manga, chapter.id.toString(), `Chapitre ${chapter.number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [{ pages }] = await this.FetchAPI<APIPages>(`./chapters?select=pages(page_number,image_url)&id=eq.${chapter.Identifier}`);
        return pages.map(page => new Page(this, chapter, new URL(page.image_url, this.cdnUrl)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiUrl), {
            headers: this.apiHeaders
        });
        return await FetchJSON<T>(request);
    }
}