import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { Fetch } from '../../platform/FetchProvider';

type TNextActions = {
    PaginatedMangas: string;
    MangaInfos: string;
    Chapters: string;
    Pages: string;
};

type APIManga = {
    id: string;
    title: string;
    link: string;
};

type APIMangas = {
    projects: APIManga[];
};

type APIChapters = {
    groups: {
        chapters: {
            id: string;
            title: number;
        }[]
    }[];
};
type APIPages = {
    pages?: {
        photo: string;
    }[];
};

@Common.ImageAjax(true)
export class YomuVerseBase extends DecoratableMangaScraper {

    private NextActions: Record<string, string> = {
        PaginatedMangas: '',
        MangaInfos: '',
        Chapters: '',
        Pages: ''
    };

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/[^/]+$`).test(url);
    }

    public WithNextActions(actions: TNextActions): YomuVerseBase {
        this.NextActions = actions;
        return this;
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const pathname = new URL(url).pathname;
        const [, mangaId, mangaSlug] = pathname.split('/');
        const { title } = await this.FetchAPI<APIManga>(pathname, 'MangaInfos', JSON.stringify([mangaId, mangaSlug]));
        return new Manga(this, provider, pathname, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { projects } = await this.FetchAPI<APIMangas>(`./projetos?page=${page}`, 'PaginatedMangas', JSON.stringify([page]));
                const mangas = projects.map(({ id, link, title }) => new Manga(this, provider, `/${id}/${link}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [, mangaId, mangaSlug] = manga.Identifier.split('/');
        const { groups } = await this.FetchAPI<APIChapters>(manga.Identifier, 'Chapters', JSON.stringify([mangaId, mangaSlug]));
        return groups.at(0).chapters.map(({ title }) => new Chapter(this, manga, `${manga.Identifier}/capitulo/${title}`, `Capítulo ${title}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [, mangaId, , , chapterId] = chapter.Identifier.split('/');
        const { pages } = await this.FetchAPI<APIPages>(chapter.Identifier, 'Pages', JSON.stringify([mangaId, chapterId]));
        return pages ? pages.map(({ photo }) => new Page(this, chapter, new URL(photo, this.URI))) : [];
    }

    public async FetchAPI<T extends JSONElement>(endpoint: string, operationName: string, body: string): Promise<T> {
        const response = await Fetch(new Request(new URL(endpoint, this.URI), {
            method: 'POST',
            headers: {
                'Next-Action': this.NextActions[operationName]
            },
            body
        }));
        const text = await response.text();
        return JSON.parse(text.split('\n').at(1).slice(2)) as T;
    }
}