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
        const { data: { comic } } = await FetchJSON<APIResult<APIComicDetails>>(new Request(new URL(`v1/page/episode?comicId=${mangaId}`, this.apiUrl)));
        return new Manga(this, provider, mangaId, comic.information.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ...await this.GetMangas(provider, 'v1/page/new'),
            ...await this.GetMangas(provider, 'v2/popular/monthly'),
            ...await this.GetMangas(provider, 'v1/page/binge'),
        ].distinct();
    }

    private async GetMangas(provider: MangaPlugin, path: string): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIComicList>>(new Request(new URL(path, this.apiUrl)));
        const comics = data[path.split('/').at(-1)] ?? [];
        return comics.map(comic => new Manga(this, provider, comic.comicId.toString(), comic.information.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { episode } } = await FetchJSON<APIResult<APIComicDetails>>(new Request(new URL(`v1/page/episode?comicId=${manga.Identifier}`, this.apiUrl)));
        return episode.map(episode => new Chapter(this, manga, `/content/${manga.Identifier}/${episode.episodeId}`, episode.information.title));
    }
}