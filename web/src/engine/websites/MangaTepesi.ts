import { Tags } from '../Tags';
import icon from './MangaTepesi.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    mangaId: number;
    title: string;
    titleUrl: string;
};

type APIMangaDetails = {
    manga: APIManga;
    chapters: {
        id: number;
        chapterName: string;
        chapterNameUrl: string;
    }[];
};

type APIPages = {
    images: {
        imgUrl: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.mangatepesi.com/api/';

    public constructor() {
        super('mangatepesi', `MangaTepesi`, 'https://mangatepesi.com', Tags.Language.Turkish, Tags.Source.Scanlator, Tags.Media.Manga, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname;
        const { manga: { title } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`.${id}`, this.apiURL)));
        return new Manga(this, provider, id.replace(/^\/manga\//, ''), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIManga[]>(new Request(new URL('./mangaList', this.apiURL)));
        return mangas.map(({ mangaId, title, titleUrl }) => new Manga(this, provider, `${titleUrl}/${mangaId}`, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./manga/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ chapterNameUrl, chapterName, id }) => new Chapter(this, manga, `${chapterNameUrl}/${id}`, chapterName)).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [mangaSlug] = chapter.Parent.Identifier.split('/');
        const { images } = await FetchJSON<APIPages>(new Request(new URL(`./manga/${mangaSlug}/chapter/${chapter.Identifier}`, this.apiURL)));
        return images.map(({ imgUrl }) => new Page(this, chapter, new URL(imgUrl, this.URI)));
    }
}