import { Tags } from '../Tags';
import icon from './Dilar.webp';
import { Chapter, DecoratableMangaScraper, Page, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';

type APIMangas = {
    series: APIManga[];
};

type APIManga = {
    id: string;
    title: string;
    chapters: APIChapter[];
};

type APIChapter = {
    chapter: string;
    releases: {
        id: string;
        teams: {
            name: string;
        }[];
    }[],
    pages: {
        url: string;
    }[],
    storage_key: string;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://dilar.tube/api/';

    public constructor() {
        super('dilar', `Dilar`, 'https://dilar.tube', Tags.Language.Arabic, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/\\d+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await FetchJSON<APIManga>(new Request(new URL(`./series/${url.split('/').at(-2)}`, this.apiUrl)));
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                await Delay(500);
                const { series } = await FetchJSON<APIMangas>(new Request(new URL(`./series/?page=${page}`, this.apiUrl)));
                const mangas = !series ? [] : series.map(({ id, title }) => new Manga(this, provider, id, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./series/${manga.Identifier}/chapters`, this.apiUrl)));
        return chapters.reduce((accumulator: Chapter[], entry) => {
            const chapters = entry.releases.map(({ id, teams }) => new Chapter(this, manga, id, `${entry.chapter} [${teams.at(0).name}]`));
            accumulator.push(...chapters);
            return accumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages, storage_key } = await FetchJSON<APIChapter>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(`/uploads/releases/${storage_key}/hq/${url}`, this.URI)));
    }
}