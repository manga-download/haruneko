import { Tags } from '../Tags';
import icon from './iqiyi.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { MD5 } from '../Crypto';
import { GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';

type AuthData = {
    qiyiID: string;
    authCookie: string;
    userID: string;
};

type APIResult<T> = {
    data: T;
};

type APIMangas = {
    comics: {
        id: number;
        title: string;
    }[];
};

type APIMangaDetails = {
    allCatalog: {
        comicTitle: string;
        comicEpisodes: APIChapter[];
    };
}

type APIPages = {
    episodes: APIChapter[];
};

type APIChapter = {
    episodeId: number;
    episodeOrder: number;
    episodeTitle: string;
    episodePicture: {
        imageUrlList: {
            imageUrl: string;
            resolution: number;
        }[];
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://comic.iqiyi.com/';
    private readonly websiteToken = '0n9wdzm8pcyl1obxe0n9qdzm2pcyf1ob';
    private authData: AuthData = undefined;

    public constructor() {
        super('iqiyi', 'iqiyi', 'https://manhua.iqiyi.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        this.authData = await FetchWindowScript<AuthData>(new Request(this.URI), `
            new Promise(resolve => {
                const qiyiID = JSON.parse(localStorage.getItem('QIYI_ID') ?? '{}')?.data ?? '';
                const userInfosObj = JSON.parse(localStorage.getItem('USER_INFO') ?? '{}')?.data ?? undefined;
                resolve({
                    qiyiID,
                    authCookie: userInfosObj?.authCookie,
                    userID: userInfosObj?.userInfo.uid
                });
            })
        `);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/reader\\?comicId=\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).searchParams.get('comicId');
        const { allCatalog: { comicTitle } } = await this.FetchAPI<APIMangaDetails>(`/views/comicCatalog?comicId=${id}&episodeIndex=0&order=0&size=0`);
        return new Manga(this, provider, id, comicTitle);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run && page < 1000; page++) {
                const { comics } = await this.FetchAPI<APIMangas>(`/views/1.0/classify/detail?three_category=-1&pageSize=200&pageNum=${page}&if=comics&type=list&mode=9&serialize_status=-1&pay_status=-1&data_type=21`);
                const mangas = comics.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { allCatalog: { comicEpisodes } } = await this.FetchAPI<APIMangaDetails>(`/views/comicCatalog?comicId=${manga.Identifier}&episodeIndex=0&order=0&size=10000`);
        return comicEpisodes
            .sort((self, other) => other.episodeOrder - self.episodeOrder)
            .map(({ episodeId, episodeTitle }) => new Chapter(this, manga, `${episodeId}`, episodeTitle));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { episodes } = await this.FetchAPI<APIPages>(`/read/1.0/batchRead?comicId=${chapter.Parent.Identifier}&episodeId=${chapter.Identifier}&order=0&size=0`);
        return episodes.at(0).episodePicture.map(({ imageUrlList }) => {
            const imageUrl = (imageUrlList.find(({ resolution }) => resolution === 0) ?? imageUrlList[0]).imageUrl;
            return new Page(this, chapter, new URL(imageUrl, this.URI));
        });
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const url = new URL(new URL(endpoint, this.apiURL));
        url.searchParams.set('qiyiId', this.authData.qiyiID);
        url.searchParams.set('timeStamp', `${Date.now()}`);
        url.searchParams.set('srcPlatform', '23');
        url.searchParams.set('appVer', '100.0.0');
        url.searchParams.set('agentVersion', 'h5');
        if (this.authData.userID) url.searchParams.set('userId', this.authData.userID);
        const cipher = `${url.pathname}${url.search.slice(1)}${this.authData.authCookie ?? ''}${this.websiteToken}`;

        return (await FetchJSON<APIResult<T>>(new Request(url, {
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href,
                MD5: GetHexFromBytes(MD5(GetBytesFromUTF8(cipher)))
            }
        }))).data;
    }
}