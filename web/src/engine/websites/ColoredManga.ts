import { Tags } from '../Tags';
import icon from './ColoredManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    name: string
    chapters: APIChapter[]
    volume: APIVolume[];
}

type APIChapter = {
    id: string,
    title: string,
    number: string,
    totalImage: number,
    volume?: string;
}

type APIVolume = {
    number: string,
    chapters: APIChapter[]
}

type APIImage = {
    image : string //base64 image data URI
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {

    return {
        id: anchor.pathname.match(/\/manga\/([^/]+)/)[1],
        title: anchor.text.trim()
    };
}

@Common.MangasSinglePageCSS('/manga', 'div#themes_outside__WCut6 a:not([id])', MangaInfoExtractor)

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
        const { name } = await this.GetMangaData(mangaSlug);
        return new Manga(this, provider, mangaSlug, name);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaData = await this.GetMangaData(manga.Identifier);
        return this.ExtractChaptersData(mangaData).map(chapter => {
            const title = [
                chapter.number,
                chapter.title ? '-' : '',
                chapter.title,
            ].join(' ').trim();
            return new Chapter(this, manga, chapter.id, title);
        });
    }

    private ExtractChaptersData(mangaData: APIManga): APIChapter[] {
        return mangaData.chapters.length > 0 ? mangaData.chapters : mangaData.volume.reduce((chaptersAccumulator: APIChapter[], currentVolume) => {
            currentVolume.chapters.forEach(chapter => chapter.volume = currentVolume.number);
            chaptersAccumulator.push(...currentVolume.chapters);
            return chaptersAccumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaData = await this.GetMangaData(chapter.Parent.Identifier);
        const { totalImage, volume } = this.ExtractChaptersData(mangaData).find(item => item.id === chapter.Identifier);
        const path = volume ? `/images/content/${mangaData.name}/${volume}/${chapter.Title}` : `/images/content/${mangaData.name}/${chapter.Title}`;
        return new Array(totalImage).fill(0).map((_, index) => new Page(this, chapter, this.URI, { path, number: (index + 1).toString().padStart(4, '0') }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {

        return await this.imageTaskPool.Add(async () => {

            const request = this.CreateRequest('dynamicImages', {
                path: page.Parameters['path'] as string,
                number: page.Parameters['number'] as string
            });

            const { image } = await FetchJSON<APIImage>(request);
            const response = await fetch(image);
            return Common.GetTypedData(await response.arrayBuffer());

        }, priority, signal);
    }

    private async GetMangaData(mangaSlug: string): Promise<APIManga> {
        return await FetchJSON<APIManga>(this.CreateRequest('selectedManga', {
            id: mangaSlug
        }));
    }

    private CreateRequest(endpoint: string, records: Record<string, string>): Request {
        const formData = new FormData();
        Object.keys(records).forEach(key => formData.set(key, records[key]));
        return new Request(new URL(endpoint, this.apiUrl), {
            method: 'PUT',
            body: formData
        });
    }
}
