import { Tags } from '../Tags';
import icon from './Voyce.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';

enum GQLMedia {
    Manga = 2,
    Webcomic = 4,
    Novel = 6,
};

type GQLMangas = {
    voyce_series: {
        id: number;
        title: string;
    }[];
};

type GQLChapters = {
    voyce_chapters: {
        id: number,
        title: string;
    }[];
};

type GQLPages = {
    voyce_chapter_images: {
        image: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://graphql.voyce.me/v1/graphql/';
    private readonly cdnURL = 'https://dlkfxmdtxtzpb.cloudfront.net/';

    public constructor () {
        super('voyce', `Voyce`, 'https://www.voyce.me', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { voyce_series: [ { id, title } ] } = await FetchGraphQL<GQLMangas>(new Request(this.apiURL), undefined, `
            query ($slug: String) {
                voyce_series(where: { slug: { _eq: $slug } }) { id, title }
            }
        `, { slug: url.split('/').at(-1) });
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { voyce_series: mangas } = await FetchGraphQL<GQLMangas>(new Request(this.apiURL), undefined, `
            query ($where: voyce_series_bool_exp) {
                voyce_series(limit: 100000, where: $where) {
                  id, title
                }
            }
        `, {
            where: {
                chapter_count: { _gt: 0 },
                is_deleted: { _eq: false },
                comic_type_id: { _in: [ GQLMedia.Manga, GQLMedia.Webcomic ] },
            }
        });
        return mangas.map(manga => new Manga(this, provider, `${manga.id}`, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { voyce_chapters: chapters } = await FetchGraphQL<GQLChapters>(new Request(this.apiURL), undefined, `
            query ($id: Int) {
                voyce_chapters(where: { series: { id: { _eq: $id } } }) { id, title }
            }
        `, { id: parseInt(manga.Identifier) });
        return chapters.map(chapter => new Chapter(this, manga, `${chapter.id}`, chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { voyce_chapter_images: pages } = await FetchGraphQL<GQLPages>(new Request(this.apiURL), undefined, `
            query ($id: Int) {
                voyce_chapter_images(
                    where: { chapter: { id: { _eq: $id } } }
                    order_by: { sort_order: asc, id: asc }
                ) { image }
            }
        `, { id: parseInt(chapter.Identifier) });
        return pages.map(page => new Page(this, chapter, new URL(page.image, this.cdnURL)));
    }
}