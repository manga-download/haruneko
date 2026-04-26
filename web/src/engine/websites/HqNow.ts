import { Tags } from '../Tags';
import icon from './HqNow.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';

type APIMangas = {
    id: number;
    name: string;
    capitulos: {
        id: number;
        name: string;
        number: number;
    }[];
}[];

type GQLMangasByLetter = {
    getHqsByNameStartingLetter: APIMangas;
};

type GQLMangasByID = {
    getHqsById: APIMangas;
};

type GQLPages = {
    getChapterById: {
        number: number;
        pictures: { pictureUrl: string; }[];
        hq: { name: string; };
    };
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://admin.hq-now.com';

    public constructor() {
        super('hqnow', `Hq Now`, 'https://www.hq-now.com', Tags.Language.Spanish, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/hq/[\\d]+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = parseInt(new URL(url).pathname.match(/\/hq\/([\d]+)/).at(-1));
        const { getHqsById } = await FetchGraphQL<GQLMangasByID>(new Request(new URL('/graphql', this.apiUrl)), undefined, `
            query ($id: Int!) {
                getHqsById(id: $id) { id, name }
            }
        `, { id });
        return new Manga(this, provider, `${id}`, getHqsById.at(0).name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { getHqsByNameStartingLetter } = await FetchGraphQL<GQLMangasByLetter>(new Request(new URL('/graphql', this.apiUrl)), undefined, `
            query ($letter: String!) {
                getHqsByNameStartingLetter(letter: $letter) { id, name }
            }
        `, { letter: '0-z' });
        return getHqsByNameStartingLetter.map(({ id, name }) => new Manga(this, provider, `${id}`, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { getHqsById } = await FetchGraphQL<GQLMangasByID>(new Request(new URL('/graphql', this.apiUrl)), undefined, `
            query ($id: Int!) {
                getHqsById(id: $id) { id, name, capitulos { id, name, number } }
            }
        `, { id: parseInt(manga.Identifier) });
        return getHqsById.at(0).capitulos.map(({ id, name, number }) => {
            const chapterName = name ? `${number}` + ' : ' + name.trim() : `${number}`;
            return new Chapter(this, manga, `${id}`, chapterName);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { getChapterById: { pictures } } = await FetchGraphQL<GQLPages>(new Request(new URL('/graphql', this.apiUrl)), undefined, `
            query ($chapterId: Int!) {
                getChapterById(chapterId: $chapterId) { pictures { pictureUrl } }
            }
        `, { chapterId: parseInt(chapter.Identifier) });
        return pictures.map(({ pictureUrl }) => new Page(this, chapter, new URL(pictureUrl)));
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        const urlFriendly = (e: string): string => {
            return e.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        };

        const { getChapterById: { hq: { name }, number } } = await FetchGraphQL<GQLPages>(new Request(new URL('/graphql', this.apiUrl)), undefined, `
            query ($chapterId: Int!) {
                getChapterById(chapterId: $chapterId) { number, hq { name } }
            }
        `, { chapterId: parseInt(chapter.Identifier) });

        return new URL(`/hq-reader/${chapter.Identifier}/${urlFriendly(name)}/chapter/${number}/page/1`, this.URI);
    }
}