import { Tags } from '../Tags';
import icon from './TopToon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T
};

type APIMangas = APIResult<{
    totalSearch: APIManga[];
}>;

type APIMangaDetails = APIResult<{
    comic: APIManga;
    episode: APIChapter[];
}>;

type APIManga = {
    comicId: number,
    information: {
        title: string;
    }
};

type APIChapter = {
    episodeId: number;
    information: {
        title: string;
        subTitle: string;
    }
};

type UserInfos = {
    token: string;
    deviceId: string;
    userId: number;
};

@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#comicContent div.imgSubWrapper img')].map(image => image.dataset.src);`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api-global.toptoon.com/api/';
    private userInfos: UserInfos = {
        token: '',
        deviceId: '',
        userId: 0
    };

    public constructor() {
        super('toptoonglobal', 'Toptoon (Global)', 'https://global.toptoon.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    private async GetUserInfos(): Promise<void> {
        this.userInfos = await FetchWindowScript<UserInfos>(new Request(this.URI), `
            new Promise(async (resolve, reject) => {
                const result  = {
                    token: '',
                    deviceId : '',
                    userId: 0
                };
                try {
                    result.deviceId = localStorage.getItem('udid');
                    const sessionData = (await window.cookieStore.get('userSession'))?.value;
                    if (sessionData) {
                        const decodedData = JSON.parse(sessionData.decodeString('test'));
                        result.token = decodedData.token;
                        result.userId = decodedData.userId;
                    } 
                } catch(error) {
                    reject(error);
                } finally {
                    resolve(result);
                }
            });`, 1500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { comic: { comicId, information: { title } } } } = await this.FetchAPI<APIMangaDetails>(`./v1/page/episode?comicId=${url.split('/').at(-1)}`);
        return new Manga(this, provider, `${comicId}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        //We only need user token to fetch adult mangas in list (in case he activated adult flag)
        await this.GetUserInfos();

        const { data: { totalSearch } } = await this.FetchAPI<APIMangas>('./v1/search/totalsearch');
        return totalSearch.map(({ comicId, information: { title } }) => new Manga(this, provider, `${comicId}`, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { episode } } = await this.FetchAPI<APIMangaDetails>(`./v1/page/episode?comicId=${manga.Identifier}`);
        return episode.map(({ episodeId, information: { title, subTitle } }) => new Chapter(this, manga, `/content/${manga.Identifier}/${episodeId}`, [title, subTitle].filter(Boolean).join(' - ').trim()));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                deviceId: this.userInfos.deviceId,
                token: this.userInfos.token,
                language: 'en',
                'user-id': `${this.userInfos.userId}`
            }
        }));
    }
}