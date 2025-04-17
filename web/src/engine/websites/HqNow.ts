import { Tags } from '../Tags';
import icon from './HqNow.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';

type APIMangas = {
    getHqsByNameStartingLetter: APIManga[],
};

type APISingleManga = {
    getHqsById: APIManga[],
};

type APIManga = {
    id: number,
    name: string,
    capitulos: APIChapter[]
};

type APIChapter = {
    name: string,
    id: number,
    number: number
};

type APIPages = {
    getChapterById: {
        pictures: { pictureUrl: string }[]
    }
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
        const id = parseInt(new URL(url).pathname.match(/\/hq\/([\d]+)/).at(1));
        const variables: JSONObject = {
            id: id
        };
        const query = `
            query getHqsById($id: Int!) {
                getHqsById(id: $id) {
                    id
                    name
                }
            }
        `;
        const { getHqsById } = await FetchGraphQL<APISingleManga>(new Request(new URL('/graphql', this.apiUrl)), 'getHqsById', query, variables);
        return new Manga(this, provider, id.toString(), getHqsById.at(0).name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const variables: JSONObject = {
            letter: '0-z'
        };
        const query = `
            query getHqsByNameStartingLetter($letter: String!) {
                getHqsByNameStartingLetter(letter: $letter) {
                    id
                    name
                }
            }
        `;
        const { getHqsByNameStartingLetter } = await FetchGraphQL<APIMangas>(new Request(new URL('/graphql', this.apiUrl)), 'getHqsByNameStartingLetter', query, variables);
        return getHqsByNameStartingLetter.map(manga => new Manga(this, provider, String(manga.id), manga.name));

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const variables: JSONObject = {
            id: parseInt(manga.Identifier)
        };
        const query = `
            query getHqsById($id: Int!) {
                getHqsById(id: $id) {
                    id
                    name
                    capitulos {
                        name
                        id
                        number
                    }
                }
            }
        `;
        const { getHqsById } = await FetchGraphQL<APISingleManga>(new Request(new URL('/graphql', this.apiUrl)), 'getHqsById', query, variables);
        return getHqsById.at(0).capitulos.map(chapter => {
            const name = chapter.name ? `${chapter.number} : ${chapter.name.trim()}` : chapter.number.toString();
            return new Chapter(this, manga, chapter.id.toString(), name);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const variables: JSONObject = {
            chapterId: parseInt(chapter.Identifier)
        };
        const query = `
            query getChapterById($chapterId: Int!) {
                getChapterById(chapterId: $chapterId) {
                    name
                    number
                    pictures {
                        pictureUrl
                    }
                }
            }
        `;
        const { getChapterById: { pictures } } = await FetchGraphQL<APIPages>(new Request(new URL('/graphql', this.apiUrl)), 'getChapterById', query, variables);
        return pictures.map(page => new Page(this, chapter, new URL(page.pictureUrl.replace(/^http:\/\//, 'https://'))));

    }

}