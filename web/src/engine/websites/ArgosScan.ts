import { Tags } from '../Tags';
import icon from './ArgosScan.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch } from '../platform/FetchProvider';

const NextActions: Record<string, string> = {
    MangaInfos: '607c95dc8377d4b2af506cb68b7a74a45e66a472d9',
    Chapters: '602cb740c86618ab9c2bcd782127cc984b19f48de4',
    Pages: '607776aec18ad3256b8c7b1e91ae6961d84a15b58a'
};

type APIManga = {
    title: string;
};

type APIChapters = {
    groups: {
        chapters: {
            id: string;
            title: number;
        }[]
    }[],
};
type APIPages = {
    pages: {
        photo: string;
    }[]
};

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('argosscan', `Argos Scan`, 'https://argoscomic.com', Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Media.Manhwa, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        const [, mangaId, mangaSlug] = mangaUrl.pathname.split('/');
        const { title } = await this.FetchAPI<APIManga>(mangaUrl.pathname, 'MangaInfos', JSON.stringify([mangaId, mangaSlug]));
        return new Manga(this, provider, new URL(url).pathname, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaUrl = new URL(manga.Identifier, this.URI);
        const [, mangaId, mangaSlug] = mangaUrl.pathname.split('/');
        const { groups } = await this.FetchAPI<APIChapters>(mangaUrl.pathname, 'Chapters', JSON.stringify([mangaId, mangaSlug]));
        return groups.at(0).chapters.map(({ title }) => new Chapter(this, manga, `${manga.Identifier}/capitulo/${title}`, `Capítulo ${title}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const [, mangaId, , , chapterId] = chapterUrl.pathname.split('/');
        const { pages } = await this.FetchAPI<APIPages>(chapterUrl.pathname, 'Pages', JSON.stringify([mangaId, chapterId]));
        return pages.map(({ photo }) => new Page(this, chapter, new URL(photo, this.URI)));
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