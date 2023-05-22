import { Tags } from '../Tags';
import icon from './HqNow.webp';
import { Chapter, DecoratableMangaScraper,Manga,Page,type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL, FetchRequest } from '../FetchProvider';

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

const apiUrl = 'https://admin.hq-now.com';

@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hqnow', `Hq Now`, 'https://www.hq-now.com', Tags.Language.Spanish, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/www\.hq-now\.com\/hq\/([\d]+)/.test(url);
    }
    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = parseInt(new URL(url).pathname.match(/\/hq\/([\d]+)/)[1]);
        const gql = {
            operationName: 'getHqsById',
            variables: {
                id: id
            },
            query: `query getHqsById($id: Int!) {
                getHqsById(id: $id) {
                    id
                    name
                    synopsis
                    editoraId
                    status
                    publisherName
                    hqCover
                    impressionsCount
                    capitulos {
                        name
                        id
                        number
                    }
                }
            }
            `
        };

        const request = new FetchRequest(new URL('/graphql', apiUrl).href);
        const data = await FetchGraphQL<APISingleManga>(request, gql.operationName, gql.query, JSON.stringify(gql.variables));
        return new Manga(this,provider, String(id), data.getHqsById[0].name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const gql = {
            operationName: 'getHqsByNameStartingLetter',
            variables: {
                letter: '0-z'
            },
            query: `query getHqsByNameStartingLetter($letter: String!) {
                getHqsByNameStartingLetter(letter: $letter) {
                    id
                    name
                    editoraId
                    status
                    publisherName
                    impressionsCount
                }
            }
            `
        };

        const request = new FetchRequest(new URL('/graphql', apiUrl).href);
        const data = await FetchGraphQL<APIMangas>(request, gql.operationName, gql.query, JSON.stringify(gql.variables));
        return data.getHqsByNameStartingLetter.map(manga => new Manga(this, provider, String(manga.id), manga.name));

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const gql = {
            operationName: 'getHqsById',
            variables: {
                id: parseInt(manga.Identifier)
            },
            query: `query getHqsById($id: Int!) {
                getHqsById(id: $id) {
                    id
                    name
                    synopsis
                    editoraId
                    status
                    publisherName
                    hqCover
                    impressionsCount
                    capitulos {
                        name
                        id
                        number
                    }
                }
            }
            `
        };

        const request = new FetchRequest(new URL('/graphql', apiUrl).href);
        const data = await FetchGraphQL<APISingleManga>(request, gql.operationName, gql.query, JSON.stringify(gql.variables));
        return data.getHqsById[0].capitulos.map(chapter => {
            const name = chapter.name ? String(chapter.number) + ' : ' + chapter.name.trim() : String(chapter.number);
            return new Chapter(this, manga, String(chapter.id), name);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const gql = {
            operationName: 'getChapterById',
            variables: {
                chapterId: parseInt(chapter.Identifier)
            },
            query: `query getChapterById($chapterId: Int!) {
                getChapterById(chapterId: $chapterId) {
                    name
                    number
                    oneshot
                    pictures {
                        pictureUrl
                    }
                    hq {
                        id
                        name
                        capitulos {
                            id
                            number
                        }
                    }
                }
            }
            `
        };
        const request = new FetchRequest(new URL('/graphql', apiUrl).href);
        const data = await FetchGraphQL<APIPages>(request, gql.operationName, gql.query, JSON.stringify(gql.variables));
        return data.getChapterById.pictures.map(page => new Page(this, chapter, new URL(page.pictureUrl)));

    }

}