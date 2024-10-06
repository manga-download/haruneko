import { Tags } from '../Tags';
import icon from './DayComics.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

const matureCookieScript = `
    new Promise(async (resolve, reject) => {
        try {
            const sessionData = (await window.cookieStore.get('userSession'))?.value;
            if (sessionData) {  //if user is Logged, set mature to 1
                const decodedData = JSON.parse(sessionData.decodeString('test'));
                decodedData.mature = 1;
                const cookieValue = JSON.stringify(decodedData).unicode().encodeString('test');
                window.cookieStore.set('userSession', cookieValue);
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

const libraryScript = `
    [...document.querySelectorAll('section#libraryPage a[href*="/content/"')].map(anchor => {
      const link = anchor.pathname;
      const title = anchor.querySelector('div.comicInfo > div > div').textContent.trim();
      return {
          id : link,
          title : title
      }});
`;

const chapterScript = `
    [...document.querySelectorAll('a#episodeItemCon')].map(anchor => {
      const link = anchor.pathname;
      let title = anchor.querySelector('div.comicInfo > div > div').textContent.trim();
      const subtitle = anchor.querySelector('p.episodeStitle')?.textContent.trim();
      title = subtitle ? title +': '+ subtitle : title;
      return {
          id : link,
          title : title
      }});

`;

const pageScript = `[...document.querySelectorAll('div#comicContent div.imgSubWrapper img')].map(image => image.dataset.src);`;

type APIResult<T> = {
    data: T
}

type APIComicForLibrary = {
    id: string,
    title: string
}

type APIComic = {
    comicId: number,
    information: {
        title: string
    }
}

type APIComicList = Record<string, APIComic[]>

type NEXTDATACOMIC = {
    props: {
        pageProps: {
            comicTitle: string,
            comicId: number
        }
    }
}

@Common.ChaptersSinglePageJS(chapterScript, 2500)
@Common.PagesSinglePageJS(pageScript, 2500)
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
        return FetchWindowScript(new Request(this.URI), matureCookieScript, 500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { props: { pageProps: { comicTitle, comicId } } } = await FetchWindowScript<NEXTDATACOMIC>(new Request(url), '__NEXT_DATA__', 2500);
        return new Manga(this, provider, `/content/${comicId}`, comicTitle);
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
        return comics.map(comic => new Manga(this, provider, `/content/${comic.comicId}`, comic.information.title));
    }

    private async GetMangasFromLibrary(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchWindowScript<APIComicForLibrary[]>(new Request(new URL('/library', this.URI)), libraryScript, 2500);
        return data.map(comic => new Manga(this, provider, comic.id, comic.title));
    }
}