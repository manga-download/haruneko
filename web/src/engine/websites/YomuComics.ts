import { Tags } from '../Tags';
import icon from './YomuComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    slug: string;
    title: string;
};

type HydratedChapters = {
    chapters: {
        id: string;
        title: string;
    }[]
};

type APIChapter = {
    chapter: {
        content: string[];
    }
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/obra\/[^/]+$/, 'main img.object-cover', (img, uri) => ({ id: uri.pathname.split('/').at(-1), title: img.alt.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://yomu.com.br/api/';

    public constructor() {
        super('yomucomics', 'Yomu Comics', 'https://yomu.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL('./library?page=1&limit=9999&sort=popular&type=all', this.apiUrl)));
        return data.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(new URL(`./obra/${manga.Identifier}`, this.URI)), data => 'chapters' in data);
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { content} } = await FetchJSON<APIChapter>(new Request(new URL(`./chapters?id=${chapter.Identifier}`, this.apiUrl)));
        return content.map(image => new Page(this, chapter, new URL(image, this.URI)));
    }
}