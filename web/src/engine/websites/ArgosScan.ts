import { Tags } from '../Tags';
import icon from './ArgosScan.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';
import type { JSONObject } from '../../../../node_modules/websocket-rpc/dist/types';

type ApiResult<T> = {
    [id: string]: {
        [id: string]: T
    }
}

type ApiSingleResult<T> = {
    [id: string]: T
}

type APIManga = {
    name: string,
    id: number,
    getChapters: APIChapter[]
}

type APIChapter = {
    id: number,
    number: number,
    title: string
    images: string[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('argosscan', `Argos Scan`, 'https://argosscan.com', Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Media.Manhwa, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/obras/([\\d]+)`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = parseInt(new URL(url).pathname.match(/obras\/(\d+)\//i)[1]);
        const gql = `
            query project($id: Int!) {
                project(id: $id) {
                    name
                }
            }
        `;
        const vars: JSONObject = { id: id };
        const request = new Request(new URL('/graphql', this.URI).href);
        const operationName = 'project';
        const data = await FetchGraphQL<ApiSingleResult<APIManga>>(request, operationName, gql, vars);
        const title = data[operationName].name;
        return new Manga(this, provider, String(id), title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this._getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const gql = `
            query latestProjects($filters: FiltersExpression!, $orders: OrdersExpression!, $pagination: PaginationInput) {
                getProjects(orders: $orders, filters: $filters, pagination: $pagination) {
                    projects {
                        id, name
                    } 
                }
            }
        `;
        const vars: JSONObject = {
            filters: {
                operator: "AND",
                childExpressions: [{
                    operator: "AND",
                    filters: [{
                        op: "GE",
                        field: "Project.id",
                        values: ["1"]
                    }]
                }]
            },
            orders: {
                orders: [{
                    or: "ASC",
                    field: "Project.name"
                }]
            },
            pagination: {
                limit: 100,
                page: page
            }
        };

        const request = new Request(new URL('/graphql', this.URI).href);
        const data = await FetchGraphQL<ApiResult<APIManga[]>>(request, 'latestProjects', gql, vars);
        return data['getProjects']['projects'].map(manga => new Manga(this, provider, String(manga.id), manga.name));

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const gql = `
            query project($id: Int!) {
                project(id: $id) {
                    getChapters(order: {number: DESC}) {
                        id, number, title
                    }
                }
            }
        `;
        const vars: JSONObject = { id: parseInt(manga.Identifier) };
        const request = new Request(new URL('/graphql', this.URI).href);
        const operationName = 'project';
        const data = await FetchGraphQL<ApiSingleResult<APIManga>>(request, operationName, gql, vars);
        return data[operationName].getChapters.map(chapter => {
            const title = `Ch. ${chapter.number} - ${chapter.title}`;
            return new Chapter(this, manga, String(chapter.id), title.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const gql = `
            query getChapter($filters: FiltersExpression!, $orders: OrdersExpression!) {
                getChapters(orders: $orders, filters: $filters) {
                    chapters {
                        images
                    }
                }
            }
        `;
        const vars: JSONObject = {
            filters: {
                operator: "AND",
                filters: [{
                    op: "EQ",
                    field: "Chapter.id",
                    values: [String(chapter.Identifier)]
                }],
                childExpressions: {
                    operator: "AND",
                    filters: {
                        op: "GE",
                        field: "Project.id",
                        relationField: "Chapter.project",
                        values: ["1"]
                    }
                }
            },
            orders: {
                orders: {
                    or: "ASC",
                    field: "Chapter.id"
                }
            }
        };

        const request = new Request(new URL('/graphql', this.URI).href);
        const data = await FetchGraphQL<ApiResult<APIChapter[]>>(request, 'getChapter', gql, vars);
        return data['getChapters']['chapters'][0].images.map(image => new Page(this, chapter, new URL(`images/${chapter.Parent.Identifier}/${image}`, this.URI)));

    }
}