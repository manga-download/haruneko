import { Tags } from '../Tags';
import icon from './Senkuro.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type GraphQLResult<T> = {
    data: T
}

type GraphQLBody = {
    variables: JSONElement,
    operationName: string,
    extensions: {
        persistedQuery: {
            version: number,
            sha256Hash: string
        }
    }
}

type APIManga = {
    manga: {
        slug: string,
        originalName: {
            content: string
        },
        branches: {
            id: string
        }[]
    }
}

type APIMangas = {
    mangas: {
        edges: {
            node: {
                slug: string,
                originalName: {
                    content: string
                }
            }
        }[],
        pageInfo: {
            hasNextPage: boolean,
            endCursor: string
        }
    }
}

type APIChapters = {
    mangaChapters: {
        edges: {
            node: {
                slug: string,
                number: string,
                name: string,
                volume: string
            }
        }[],
        pageInfo: {
            hasNextPage: boolean,
            endCursor: string
        }
    }
}

type APIPages = {
    mangaChapter: {
        pages: {
            image: {
                original: {
                    url: string
                }
            }
        }[]
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.senkuro.com/graphql';

    public constructor() {
        super('senkuro', 'Senkuro', 'https://senkuro.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+(\/chapters)?$`).test(url);
    }

    private async FetchMangaInfos(slug: string): Promise<APIManga> {
        const body: GraphQLBody = {
            operationName: 'fetchManga',
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '08f66ec9b6a68ceb58645213aa63f4a93e7cac2efa572654b88a625781da8b69'
                }
            },
            variables: {
                slug
            }
        };
        return await this.FetchGraphQL<APIManga>(body);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { manga } = await this.FetchMangaInfos(url.match(/manga\/([^/]+)/).at(1));
        return new Manga(this, provider, manga.slug, manga.originalName.content);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasList: Manga[] = [];
        let cursor: string = null;
        do {
            await Delay(500);
            const { mangas, mangas: { pageInfo: { hasNextPage, endCursor } } } = await this.FetchMangasData(provider, cursor);
            mangasList.push(...mangas.edges.map(manga => new Manga(this, provider, manga.node.slug, manga.node.originalName.content)));
            cursor = hasNextPage? endCursor: null;
        } while (cursor);
        return mangasList;
    }

    private async FetchMangasData(provider: MangaPlugin, after: string = null): Promise<APIMangas> {
        const body: GraphQLBody = {
            extensions: {
                persistedQuery: {
                    sha256Hash: '0fd2decbd14ae2ebcc09f6f19d0dd9474d323c55e44bd15041d18666316b0944',
                    version: 1
                }
            },
            operationName: 'fetchMangas',
            variables: {
                after,
                bookmark: {
                    exclude: [],
                    include: []
                },
                chapters: {},
                format: {
                    exclude: [],
                    include: []
                },
                label: {
                    exclude: [],
                    include: []
                },
                orderDirection: 'DESC',
                orderField: 'POPULARITY_SCORE',
                originCountry: {
                    exclude: [],
                    include: []
                },
                rating: {
                    exclude: [],
                    include: []
                },
                releasedOn: {},
                search: null,
                source: {
                    exclude: [],
                    include: []
                },
                status: {
                    exclude: [],
                    include: []
                },
                translitionStatus: {
                    exclude: [],
                    include: []
                },
                type: {
                    exclude: [],
                    include: []
                }
            }
        };

        return await this.FetchGraphQL<APIMangas>(body);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga: { branches } } = await this.FetchMangaInfos(manga.Identifier);
        const chaptersList: Chapter[] = [];
        for (const branch of branches) {
            let cursor: string = null;
            do {
                const { mangaChapters, mangaChapters: { pageInfo: { hasNextPage, endCursor } } } = await this.FetchChaptersData(branch.id, cursor);
                chaptersList.push(...mangaChapters.edges.map(chapter => {
                    const title = [`Том ${chapter.node.volume} Глава ${chapter.node.number}`, chapter.node.name].join(' ').trim();
                    return new Chapter(this, manga, chapter.node.slug, title);
                }));
                cursor = hasNextPage ? endCursor : null;
            } while (cursor);
        }
        return chaptersList;
    }

    private async FetchChaptersData(branchId: string, after: string = null): Promise<APIChapters> {
        const body: GraphQLBody = {
            extensions: {
                persistedQuery: {
                    sha256Hash: '8c854e121f05aa93b0c37889e732410df9ea207b4186c965c845a8d970bdcc12',
                    version: 1
                }
            },
            operationName: 'fetchMangaChapters',
            variables: {
                after,
                branchId,
                number: null,
                orderBy: {
                    direction: 'DESC',
                    field: 'NUMBER'
                }
            }
        };
        return await this.FetchGraphQL<APIChapters>(body);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const body: GraphQLBody = {
            extensions: {
                persistedQuery: {
                    sha256Hash: '320a2637126c71ccdbce6af04325fe2f5878cc7adf9e90d06bdd6752f9bbb14e',
                    version: 1
                }
            },
            operationName: 'fetchMangaChapter',
            variables: {
                cdnQuality: 'auto',
                slug: chapter.Identifier
            }
        };
        const { mangaChapter: { pages } } = await this.FetchGraphQL<APIPages>(body);
        return pages.map(page => new Page(this, chapter, new URL(page.image.original.url)));
    }

    private async FetchGraphQL<T extends JSONElement>(body: GraphQLBody): Promise<T> {
        const { data } = await FetchJSON<GraphQLResult<T>>(new Request(new URL(this.apiUrl), {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json',
                Origin: this.URI.origin,
                Referrer: this.URI.href
            }
        }));
        return data;
    }
}