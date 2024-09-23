import { Tags } from '../Tags';
import icon from './DayComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise ( resolve =>  resolve([...document.querySelectorAll('div#comicContent div.imgSubWrapper img')].map(image => image.dataset.src)));
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

type APIComicList = {
    new?: APIComic[],
    binge?: APIComic[],
    montly?: APIComic[]
}

type APIChapter = {
    episodeId: number,
    information: {
        title: string,
        subtitle : string
    }
}

type MatureToken = {
    token: string
}

@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.daycomics.com/api/';
    public constructor() {
        super('daycomics', `DayComics`, 'https://daycomics.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //Set +18 cookie for not logged person. Logged people will have to take care of that themselves (-change account settings )
        const { data: { token } } = await FetchJSON<APIResult<MatureToken>>(new Request('https://api.daycomics.com/preAuth/setMature', {
            method: 'POST',
            body: JSON.stringify({
                mature: 1
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }));

        const cookieToken = this.EncodeString(this.FilterChars(JSON.stringify(token)), 'test');
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('pa_t', '${cookieToken}')`);

    }

    private FilterChars(str: string): string {
        return str.replace(/[\u007F-\uFFFF]/g, function (chr) {
            return "\\u".concat("0000".concat(chr.charCodeAt(0).toString(16)).slice(-4));
        });
    }

    private EncodeString(ciphertext: string, key: string): string {
        const keys = Buffer.from(key, 'ascii');
        const charCodes = Buffer.from(ciphertext, 'ascii');
        const result = charCodes
            .map(char => keys.reduce(function (a, b) { return a ^ b; }, char));
        return Buffer.from(result).toString('hex');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.match(/\/content\/(\d+)/)[1];
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
        const comics: APIComic[] = data[path.split('/').at(-1)];
        return comics.map(comic => new Manga(this, provider, comic.comicId.toString(), comic.information.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { episode } } = await FetchJSON<APIResult<APIComicDetails>>(new Request(new URL(`v1/page/episode?comicId=${manga.Identifier}`, this.apiUrl)));
        return episode.map(episode => new Chapter(this, manga, `/content/${manga.Identifier}/${episode.episodeId}`, episode.information.title));
    }
}