import { Tags } from '../Tags';
import icon from './PunkRecords.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';

type GQLManga = {
    manga: {
        name: string;
    };
};

type GQLChapters = {
    chapters: {
        number: number;
    }[];
};

type GQLPages = {
    chapter: {
        pages: {
            original: string;
        }[];
    };
};

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname.split('/').at(-1),
        title: anchor.querySelector<HTMLParagraphElement>('p.chakra-text').textContent.trim()
    };
}

@Common.MangasSinglePageCSS('/mangas', 'ul li a[href*="/mangas/"]', MangaExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = new URL('https://api.punkrecordz.com/graphql');

    public constructor() {
        super('littlegarden', 'Punk Records', 'https://punkrecordz.com', Tags.Language.English, Tags.Language.French, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/mangas/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').at(-1);
        const { manga: { name } } = await this.FetchAPI<GQLManga>(`
            query ($slug: String) {
                manga(where: { slug: $slug }) { name }
            }
        `, { slug });
        return new Manga(this, provider, slug, name);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        for (let skip = 0, run = true; run; skip += 100) {
            const chapters = await this.GetChaptersFromPage(manga, skip);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, skip: number): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<GQLChapters>(`
            query ($slug: String, $skip: Int) {
                chapters(skip: $skip, limit: 100, where: {
                    deleted: false
                    published: true
                    manga: { slug: $slug }
                }, order: [{ field: "number", order: -1 }]) {
                    number
                    name
                }
            }
        `, { slug: manga.Identifier, skip });

        return chapters.map(({ number }) => new Chapter(this, manga, number.toString(), number.toString()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { pages } } = await this.FetchAPI<GQLPages>(`
            query ($slug: String, $number: Float) {
                chapter(where: {
                    deleted: false
                    published: true
                    number: $number
                    manga: { slug: $slug }
                }) {
                    pages { original }
                }
            }
        `, {
            slug: chapter.Parent.Identifier,
            number: parseFloat(chapter.Identifier)
        });
        return pages.map(({ original }) => new Page(this, chapter, new URL(original)));
    }

    private async FetchAPI<T extends JSONElement>(query: string, variables: JSONObject): Promise<T> {
        return FetchGraphQL<T>(new Request(this.apiURL), undefined, query, variables);
    }
}