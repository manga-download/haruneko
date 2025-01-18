import { Tags } from '../Tags';
import icon from './AllMangaTo.webp';
import { Chapter, Page } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type GraphQLResult<T> = {
    data: T
};

type APIMangas = {
    mangas: {
        edges: APIManga[],
    }
}

type APIManga = {
    _id: string,
    englishName: string | null,
    name: string,
    availableChaptersDetail: Record<string, string[]>
}

type APIChapters = {
    manga: APIManga
}

type ChapterID = {
    id: string,
    translation: string
}

type APIPages = {
    chapterPages: {
        edges: {
            pictureUrlHead: string,
            pictureUrls: {
                url: string
            }[]
        }[]
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.allanime.day/api';

    public constructor() {
        super('allmangato', `AllManga.to`, 'https://allmanga.to', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS(new Request(new URL(url)), 'ol.breadcrumb li:last-of-type')).shift().textContent.trim();
        return new Manga(this, provider, url.match(/\/manga\/([^/]+)\//)[1], title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const jsonVariables = {
            search: {
                isManga: true,
                allowAdult: true,
                allowUnknown: true
            },
            limit: 26, //impossible to change
            page: page,
            translationType: 'sub',
            countryOrigin: 'ALL'
        };
        const jsonExtensions = {
            persistedQuery: {
                version: 1,
                sha256Hash: 'a27e57ef5de5bae714db701fb7b5cf57e13d57938fc6256f7d5c70a975d11f3d'
            }
        };

        const data = await this.FetchGraphQL<APIMangas>(jsonVariables, jsonExtensions);
        return data?.mangas?.edges ? data.mangas.edges.map(manga => new Manga(this, provider, manga._id, manga.englishName ?? manga.name)) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const jsonVariables = {
            _id: manga.Identifier,
        };
        const jsonExtensions = {
            persistedQuery: {
                version: 1,
                sha256Hash: '529b0770601c7e04c98566c7b7bb3f75178930ae18b3084592d8af2b591a009f'
            }
        };
        const { manga: { availableChaptersDetail } } = await this.FetchGraphQL<APIChapters>(jsonVariables, jsonExtensions);
        return Object.keys(availableChaptersDetail).reduce((accumulator: Chapter[], key) => {
            const chapters = availableChaptersDetail[key].map(chapter => new Chapter(this, manga, JSON.stringify({ id: chapter, translation: key }), `Chapter ${chapter} [${key}]`));
            accumulator.push(...chapters);
            return accumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id, translation }: ChapterID = JSON.parse(chapter.Identifier);
        const jsonVariables = {
            mangaId: chapter.Parent.Identifier,
            translationType: translation,
            chapterString: id,
            limit: 10,
            offset: 0
        };
        const jsonExtensions = {
            persistedQuery: {
                version: 1,
                sha256Hash: '121996b57011b69386b65ca8fc9e202046fc20bf68b8c8128de0d0e92a681195'
            }
        };
        const { chapterPages: { edges } } = await this.FetchGraphQL<APIPages>(jsonVariables, jsonExtensions);
        const source = edges.find(source => source.pictureUrlHead);
        return source.pictureUrls.map(picture => new Page(this, chapter, new URL(picture.url, source.pictureUrlHead)));
    }

    private async FetchGraphQL<T extends JSONElement>(variables: JSONObject, extensions: JSONObject): Promise<T> {
        const url = new URL(`?variables=${JSON.stringify(variables)}&extensions=${JSON.stringify(extensions)}`, this.apiUrl);
        const { data } = await FetchJSON<GraphQLResult<T>>(new Request(url, {
            headers: {
                Origin: this.URI.origin
            }
        }));
        return data;
    }

}