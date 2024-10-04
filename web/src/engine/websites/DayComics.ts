import { Tags } from '../Tags';
import icon from './DayComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `[...document.querySelectorAll('div#comicContent div.imgSubWrapper img')].map(image => image.dataset.src);`;

const matureCookieScript = `
    new Promise(async (resolve, reject) => {
        try {
            const sessionData = (await window.cookieStore.get('userSession'))?.value;
            if (sessionData) {  //if user is Logged, set mature to 1
                const decodedData = JSON.parse(sessionData.decodeString('test'));
                decodedData.mature = 1;
                const cookieValue = JSON.stringify(decodedData).unicode().encodeString('test');
                window.cookieStore.set('userSession', cookieValue);
                resolve();
            } else { //set +18 for non logged user
                const response = await fetch('https://api.daycomics.com/preAuth/setMature', {
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
                window.cookieStore.set('pa_t', cookieValue);
            }
            resolve();
        }
        catch (error) {
            reject(error);
        }
    });
`;

const GetHeadersScript = `
    new Promise(async (resolve, reject) => {
        try {
            const result = {};

            const sessionData = (await window.cookieStore.get('userSession'))?.value;
            if (sessionData) {  //if user is Logged, set mature to 1
                const decodedData = JSON.parse(sessionData.decodeString('test'));
                result['user-Id'] = decodedData.userId.toString();
                result.token = decodedData.token;
            }

            result['x-api-key'] = 'SUPERCOOLAPIKEY2021';
            result.deviceId =  localStorage.getItem('udid');
            result.language = 'en';
            result['x-origin'] = window.location.origin;
            result.ua = 'web';
            result['package-name'] = 'web';
            result.timestamp = Math.floor((new Date()).getTime()).toString();

            //get fingerprint
            let fpCookiedata = (await window.cookieStore.get('u_fp_v3'))?.value;
            if (fpCookiedata) result['visitor-id'] = fpCookiedata
            else {
                fpCookiedata = (await window.cookieStore.get('u_fp_v4'))?.value;
                if (fpCookiedata) result['visitor-id'] = JSON.parse(fpCookiedata.decodeString('visitorUnicode'));
            }
            resolve(result);
        }
        catch (error) {
            reject(error);
        }
    });

`;

type APIResult<T> = {
    data: T
}

type APIComicDetails = {
    comic: APIComic,
    episode : APIChapter[]
}

type APIComic = {
    comicId: number,
    language: string,
    information: {
        title: string
    }
}

type APIComicList = Record<string, APIComic[]>

type APIChapter = {
    episodeId: number,
    information: {
        title: string,
        subtitle : string
    }
}

type APIHeaders = {
    deviceId : string,
    language: string,
    token: string,
    'x-api-key': string,
    'x-origin': string,
    'user-Id': string
    'visitor-id': string,
    ua: string,
    'package-name': string,
    timestamp: string
}

type APILibrary = {
    library: {
        meta: APIComic
    }[]
}

@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.daycomics.com/api/';
    public constructor() {
        super('daycomics', 'DayComics', 'https://daycomics.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(this.URI), matureCookieScript, 500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.split('/').at(-1);
        const endpoint = new URL(`v1/page/episode?comicId=${mangaId}`, this.apiUrl);
        const { data: { comic } } = await FetchJSON<APIResult<APIComicDetails>>(await this.CreateRequest(endpoint));
        return new Manga(this, provider, mangaId, comic.information.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ...await this.GetMangas(provider, 'v1/page/new'),
            ...await this.GetMangas(provider, 'v2/popular/monthly'),
            ...await this.GetMangas(provider, 'v1/page/binge'),
            ...await this.GetMangasFromLibrary(provider)
        ].distinct();
    }

    private async GetMangas(provider: MangaPlugin, path: string): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIComicList>>(new Request(new URL(path, this.apiUrl)));
        const comics = data[path.split('/').at(-1)] ?? [];
        return comics.map(comic => new Manga(this, provider, comic.comicId.toString(), comic.information.title));
    }

    private async GetMangasFromLibrary(provider: MangaPlugin): Promise<Manga[]> {
        try {
            const endpoint = new URL('v1/page/library', this.apiUrl);
            const { data: { library } } = await FetchJSON<APIResult<APILibrary>>(await this.CreateRequest(endpoint));
            return library.map(comic => new Manga(this, provider, comic.meta.comicId.toString(), comic.meta.information.title));
        } catch { }
        return [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const endpoint = new URL(`v1/page/episode?comicId=${manga.Identifier}`, this.apiUrl);
        const { data: { episode } } = await FetchJSON<APIResult<APIComicDetails>>(await this.CreateRequest(endpoint));
        return episode.map(episode => new Chapter(this, manga, `/content/${manga.Identifier}/${episode.episodeId}`, episode.information.title));
    }

    private async CreateRequest(endpoint: URL): Promise<Request> {
        const apiHeaders = await FetchWindowScript<APIHeaders>(new Request(new URL(this.URI)), GetHeadersScript, 1500);
        if (apiHeaders['user-Id']) {
            return new Request(endpoint, {
                headers: {
                    ...apiHeaders
                }
            });
        } else return new Request(endpoint);
    }
}