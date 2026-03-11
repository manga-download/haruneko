import { Tags } from '../Tags';
import icon from './AstralManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';

type APIMangas = {
    mangas: {
        urlId: string;
        title: string;
    }[];
};
type HydratedChapters = {
    chapters: {
        id: string;
        name: string | null;
        orderId: number;
    }[];
}

type HydratedImages = {
    images: {
        link: string;
    }[];
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:image:alt"]', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.content.replace(/\s*cover\s*/, '').trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiUrl = `${this.URI.origin}/api/`;

    public constructor() {
        super('astralmanga', 'AstralManga', 'https://astral-manga.fr', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { mangas } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas?page=1&pageSize=9999&sortBy=title&sortOrder=asc`, this.apiUrl)));
        return mangas.map(({ urlId, title }) => new Manga(this, provider, urlId, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(new URL(`/manga/${manga.Identifier}`, this.URI)), data => 'chapters' in data && 'urlId' in data);
        return chapters.map(({ id, name, orderId }) => new Chapter(this, manga, id, ['Chapitre', orderId, name ?? ''].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchNextJS<HydratedImages>(new Request(new URL(`/manga/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.URI)), data => 'images' in data);
        return images.map(({ link }) => new Page(this, chapter, new URL(link)));
    }
}