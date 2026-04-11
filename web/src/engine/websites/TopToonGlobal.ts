import { Tags } from '../Tags';
import icon from './TopToon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

const matureCookieScript = `
    new Promise(async (resolve, reject) => {
        try {
            const sessionData = (await window.cookieStore.get('userSession'))?.value;
            if (sessionData) { // if user is Logged, set mature to 1
                const decodedData = JSON.parse(sessionData.decodeString('test'));
                decodedData.mature = 1;
                const cookieValue = JSON.stringify(decodedData).unicode().encodeString('test');
                await window.cookieStore.set('userSession', cookieValue);
            }
            // set +18 for non logged user
            const response = await fetch('https://api-global.toptoon.com/preAuth/setMature', {
                method: 'POST',
                body: JSON.stringify({
                    mature: 1
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            const cookieValue = JSON.stringify(data.data.token).unicode().encodeString('test');
            await window.cookieStore.set('pa_t', cookieValue);

        } catch {
            await window.cookieStore.delete('pa_t');
        } finally {
            resolve();
        }
    });
`;

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
    auth: number;
    loginId: string;
    mature: number;
    provider: string;
    token: string;
    userId: number;
    deviceId: string;
};

@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#comicContent div.imgSubWrapper img')].map(image => image.dataset.src);`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api-global.toptoon.com/api/';
    private readonly constantHeaders = {
        language: 'en',
        'package-name': 'web',
        ua: 'web',
        version: '0.1.5a',
        'x-api-key': 'SUPERCOOLAPIKEY2021#@#(',
        'x-origin': 'global.toptoon.com'
    };
    private userInfos: UserInfos = {
        auth: 0,
        mature: 1,
        userId: 0,
        token: '',
        loginId: '',
        provider: '',
        deviceId: ''
    };

    public constructor() {
        super('toptoonglobal', 'Toptoon (Global)', 'https://global.toptoon.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(this.URI), matureCookieScript, 500);
        // TODO: Update user infos when user login/disconnect
        await this.GetUserInfos();
    }

    private async GetUserInfos(): Promise<void> {
        this.userInfos = await FetchWindowScript<UserInfos>(new Request(this.URI), `
            new Promise(async (resolve, reject) => {
                try {
                    const result  = {
                        token: '',
                        loginId: '',
                        provider: '',
                        userId: 0,
                        mature: 1,
                        auth: 0,
                        deviceId : localStorage.getItem('udid')
                    };

                    const sessionData = (await window.cookieStore.get('userSession'))?.value;
                    if (sessionData) {
                        const decodedData = JSON.parse(sessionData.decodeString('test'));
                        result.token = decodedData.token;
                        result.loginId = decodedData.loginId;
                        result.provider = decodedData.provider;
                        result.userId = Number(decodedData.userId);
                        result.mature = Number(decodedData.mature);
                        result.auth = Number(decodedData.auth);
                    } else {
                        const preAuthToken = (await window.cookieStore.get('pa_t'))?.value;
                        result.token = preAuthToken ? JSON.parse(preAuthToken.decodeString('test')) : '';
                    }

                    resolve(result);

                } catch(error) {
                    reject(error);
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
        const { data: { totalSearch } } = await this.FetchAPI<APIMangas>('./v1/search/totalsearch/');
        return totalSearch.map(({ comicId, information: { title } }) => new Manga(this, provider, `${comicId}`, title))
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { episode } } = await this.FetchAPI<APIMangaDetails>(`./v1/page/episode?comicId=${manga.Identifier}`);
        return episode.map(({ episodeId, information: { title, subTitle } }) => new Chapter(this, manga, `/content/${manga.Identifier}/${episodeId}`, [title, subTitle].filter(Boolean).join(' - ').trim()));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                ...this.constantHeaders,
                token: this.userInfos.token,
                deviceId: this.userInfos.deviceId,
                userId: `${this.userInfos.userId}`,
                pathname: '',
                timezone: 'America/New_York'
            }
        }));
    }
}