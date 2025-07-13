import { Tags } from '../Tags';
import icon from './SerenityScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    comic: {
        id: number,
        name: string,
        slug: string,
        chapters: APIChapter[]
    }
}

type APIChapter = {
    id: number,
    name: string,
    slug: string
}

@Common.PagesSinglePageCSS('div.image-item img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiurl = 'https://saucemanhwa.org/baseapi/';

    public constructor() {
        super('saucemanhwa', 'SauceManhwa', 'https://saucemanhwa.org', Tags.Media.Manhwa, Tags.Language.Polish, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { comic: { name, slug } } = await FetchJSON<APIManga>(new Request(new URL(`./comics/getComic/${url.split('/').at(-1)}`, this.apiurl)));
        return new Manga(this, provider, slug, name);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { comic: { chapters } } = await FetchJSON<APIManga>(new Request(new URL(`./comics/getComic/${manga.Identifier}`, this.apiurl)));
        return chapters.map(chapter => new Chapter(this, manga, `/${manga.Identifier}/${chapter.slug}`, `Chapter ${chapter.name}`));
    }
}