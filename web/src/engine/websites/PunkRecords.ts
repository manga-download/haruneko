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

@Common.MangasSinglePagesCSS(['/mangas'], 'ul li a[href*="/mangas/"]', MangaExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.punkrecordz.com/graphql';

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
        const query = `
            query manga(
              $slug: String
            ) {
              manga(
                where: {
                  slug: $slug
                }
              ) {
                name
              }
            }
        `;
        const { manga: { name } } = await this.FetchAPI<GQLManga>('manga', query, { slug });
        return new Manga(this, provider, slug, name);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        for (let page = 0, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const chaptersPerPage = 100;
        const query = `
            query chapters(
              $slug: String
              $limit: Int = 18
              $skip: Int = 0
              $order: Float = -1
            ) {
              chapters(
                limit: $limit
                skip: $skip
                where: {
                  deleted: false
                  published: true
                  manga: { slug: $slug, published: true, deleted: false }
                }
                order: [{ field: "number", order: $order }]
              ) {
                number
                name
              }
            }
        `;
        const { chapters } = await this.FetchAPI<GQLChapters>('chapters', query, {
            limit: chaptersPerPage,
            order: -1,
            skip: page * chaptersPerPage,
            slug: manga.Identifier
        });

        return chapters.map(({ number }) => new Chapter(this, manga, number.toString(), number.toString()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const query = `
            query chapter($slug: String, $number: Float) {
              chapter(
                where: {
                  deleted: false
                  published: true
                  number: $number
                  manga: { deleted: false, published: true, slug: $slug }
                }
              ) {
                pages {
                  original
                }
              }
            }
        `;

        const { chapter: { pages } } = await this.FetchAPI<GQLPages>('chapter', query, {
            slug: chapter.Parent.Identifier,
            number: parseFloat(chapter.Identifier)
        });
        return pages.map(({ original }) => new Page(this, chapter, new URL(original)));
    }

    private async FetchAPI<T extends JSONElement>(operationName: string, query: string, variables: JSONObject): Promise<T> {
        return FetchGraphQL<T>(new Request(new URL(this.apiUrl)), operationName, query, variables);
    }
}
