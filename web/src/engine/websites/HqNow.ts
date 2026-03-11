import { Tags } from '../Tags';
import icon from './HqNow.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';

type APIMangas = {
    id: number,
    name: string,
    capitulos: {
        id: number,
        name: string,
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
        pictures: { pictureUrl: string; }[];
    };
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://admin.hq-now.com';

    public constructor () {
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
        const request = new Request(new URL('/graphql', this.apiUrl).href);
        const data = await FetchGraphQL<GQLMangasByID>(request, undefined, `
            query ($id: Int!) {
                getHqsById(id: $id) { id, name }
            }
        `, { id });
        return new Manga(this, provider, String(id), data.getHqsById.at(0).name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL('/graphql', this.apiUrl).href);
        const data = await FetchGraphQL<GQLMangasByLetter>(request, undefined, `
            query ($letter: String!) {
                getHqsByNameStartingLetter(letter: $letter) { id, name }
            }
        `, { letter: '0-z' });
        return data.getHqsByNameStartingLetter.map(manga => new Manga(this, provider, String(manga.id), manga.name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL('/graphql', this.apiUrl).href);
        const data = await FetchGraphQL<GQLMangasByID>(request, undefined, `
            query ($id: Int!) {
                getHqsById(id: $id) { id, name, capitulos { id, name, number } }
            }
        `, { id: parseInt(manga.Identifier) });
        return data.getHqsById.at(0).capitulos.map(chapter => {
            const name = chapter.name ? String(chapter.number) + ' : ' + chapter.name.trim() : String(chapter.number);
            return new Chapter(this, manga, String(chapter.id), name);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL('/graphql', this.apiUrl).href);
        const data = await FetchGraphQL<GQLPages>(request, undefined, `
            query ($chapterId: Int!) {
                getChapterById(chapterId: $chapterId) { pictures { pictureUrl } }
            }
        `, { chapterId: parseInt(chapter.Identifier) });
        return data.getChapterById.pictures.map(page => new Page(this, chapter, new URL(page.pictureUrl)));
    }
}