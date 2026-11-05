import { Tags } from '../Tags';
import icon from './RenaScans.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIManga = {
    title: string;
    slug: string;
    chapters: APIChapter[];
};

type APIChapter = {
    id: number;
    title: string;
    chapter_number: number;
    content: string[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article.sr-only h2', (element, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: element.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/v1/`;

    public constructor() {
        super('renascans', 'RenaScans', 'https://renascans.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += 50) {
                const data = await FetchJSON<APIManga[]>(new Request(new URL(`./manga?limit=50&offset=${offset}`, this.apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${manga.Identifier}`, this.apiURL)));
        return chapters
            .sort((self, other) => other.chapter_number - self.chapter_number)
            .map(({ id, title }) => new Chapter(this, manga, `${id}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { content } = await FetchJSON<APIChapter>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiURL)));
        if (!content) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return content.map(url => new Page(this, chapter, new URL(url.startsWith('http') ? url : `/uploads/${url}`, this.URI)));
    }
}