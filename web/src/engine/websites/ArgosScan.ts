import { Tags } from '../Tags';
import icon from './ArgosScan.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch } from '../platform/FetchProvider';

const NextActions: Record<string, string> = {
    PaginatedMangas: '403672a959063bc57f102d828ca4d48fa74a43ba70',
    MangaInfos: '60d532a2a6a7a0ff42de5f69dcdf2db5860a2f76b0',
    Chapters: '607bcd9f90d5db5edaa2cf1aff7a002b5b14ead30a',
    Pages: '60390ae612bb67d3d0614b47c7fa396fa4201aa323'
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
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('argosscan', 'Argos Scan', 'https://aniargos.com', Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Media.Manhwa, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/[^/]+$`).test(url);
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
                'Next-Action': NextActions[operationName]
            },
            body
        }));
        const text = await response.text();
        return JSON.parse(text.split('\n').at(1).slice(2)) as T;
    }
}