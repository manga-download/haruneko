import { Tags } from '../Tags';
import icon from './LittleGarden.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';

type GQLChapters = {
    chapters: {
        id: number,
        name: string,
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

@Common.MangaCSS(/^{origin}\/[^/]/, 'h2.super-title')
@Common.MangasSinglePagesCSS([ '/mangas' ], 'div.listing a.no-select', Common.AnchorInfoExtractor(true))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('littlegarden', 'Little Garden', 'https://littlexgarden.com', Tags.Language.English, Tags.Language.French, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL('/graphql', this.URI).href);
        const data = await FetchGraphQL<GQLChapters>(request, undefined, `
            query ($slug: String, $order: Float!) {
                chapters(limit: 99999, skip: 0, where: {
                    deleted: false
                    published: true
                    manga: { deleted: false, published: true, slug: $slug }
                }, order: [{ field: "number", order: -1 }]) { id, number }
            }
        `, { slug: manga.Identifier.split('/').at(-1) });
        return data.chapters.map(chapter => {
            const name = chapter.name ? String(chapter.number) + ' : ' + chapter.name.trim() : String(chapter.number);
            return new Chapter(this, manga, `${chapter.number}`, name);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { pages } } = await FetchGraphQL<GQLPages>(new Request(new URL('/graphql', this.URI).href), undefined, `
            query ($slug: String, $number: Float) {
                chapter(where: {
                    deleted: false
                    published: true
                    number: $number
                    manga: { deleted: false, published: true, slug: $slug }
                }) { pages { original } }
            }
        `, {
            slug: chapter.Parent.Identifier.split('/').at(-1),
            number: parseFloat(chapter.Identifier),
        });
        return pages.map(page => new Page(this, chapter, new URL(`/static/images/${page.original}`, this.URI)));
    }
}
