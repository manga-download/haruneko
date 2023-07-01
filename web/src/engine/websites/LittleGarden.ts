import { Tags } from '../Tags';
import icon from './LittleGarden.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL, FetchRequest } from '../FetchProvider';

type APIChapters = {
    chapters: {
        id: number,
        name: string,
        number: number
    }[]
}

type ChapterIdentifier = {
    id: number,
    number: number
}

type APIPages = {
    chapter: {
        pages: {
            original: string,
            colored: string
        }[]
    }
}

@Common.MangaCSS(/https?:\/\/littlexgarden\.com\/[^/]/, 'h2.super-title')
@Common.MangasSinglePageCSS('/mangas', 'div.listing a.no-select', Common.AnchorInfoExtractor(true))
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('littlegarden', `Little Garden`, 'https://littlexgarden.com', Tags.Language.English, Tags.Language.French, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = manga.Identifier.split('/').pop();
        const operationName = 'chapters';
        const query = `query chapters($slug: String, $limit: Float, $skip: Float, $order: Float!, $isAdmin: Boolean!) {
            chapters(limit: $limit, skip: $skip, where: {
                deleted: false, published: $isAdmin, manga: {
                    slug: $slug, published: $isAdmin, deleted: false
                }
            }, order: [{ field: "number", order: $order }]) {
                id
                number
                __typename
            }
        }`;

        const variables = {
            slug: slug,
            order: -1,
            skip: 0,
            limit: 99999,
            isAdmin: true
        };
        const request = new FetchRequest(new URL('/graphql', this.URI).href);
        const data = await FetchGraphQL<APIChapters>(request, operationName, query, JSON.stringify(variables));
        return data.chapters.map(chapter => {
            const name = chapter.name ? String(chapter.number) + ' : ' + chapter.name.trim() : String(chapter.number);
            const id = JSON.stringify({ id: chapter.id, number: chapter.number });
            return new Chapter(this, manga, id, name);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaSlug = chapter.Parent.Identifier.split('/').pop();
        const chapterid: ChapterIdentifier = JSON.parse(chapter.Identifier);
        const operationName = 'chapter';
        const query = `query chapter($slug: String, $number: Float) {
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
                      __typename
                    }
                    __typename
                  }
                }`;
        const variables = {
            slug: mangaSlug,
            number: chapterid.number,
            isAdmin: true
        };
        const request = new FetchRequest(new URL('/graphql', this.URI).href);
        const data = await FetchGraphQL<APIPages>(request, operationName, query, JSON.stringify(variables));
        return data.chapter.pages.map(page => new Page(this, chapter, new URL(`/static/images/${page.original}`, this.URI)));
    }
}
