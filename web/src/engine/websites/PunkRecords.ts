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

@Common.MangasSinglePageCSS<HTMLAnchorElement>('/mangas', 'ul li a[href*="/mangas/"]', anchor => ({ id: anchor.pathname.split('/').at(-1), title: anchor.querySelector<HTMLParagraphElement>('p.chakra-text').textContent.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly CDNurl = new URL('https://api.punkrecordz.com/');
    private readonly apiURL = new URL('./graphql', this.CDNurl);

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
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let skip = 0, run = true; run; skip += 100) {
                const { chapters: chaptersData } = await this.FetchAPI<GQLChapters>(`
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
                const chapters = chaptersData.map(({ number }) => new Chapter(this, manga, `${number}`, `${number}`));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
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
        return pages.map(({ original }) => new Page(this, chapter, original.startsWith('http') ? new URL(original) : new URL(`./images/webp/${original}.webp`, this.CDNurl), { Referer: this.URI.href }));
    }

    private async FetchAPI<T extends JSONElement>(query: string, variables: JSONObject): Promise<T> {
        return FetchGraphQL<T>(new Request(this.apiURL), undefined, query, variables);
    }
}