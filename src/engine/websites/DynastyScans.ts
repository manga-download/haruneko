import { IMangaHost, IManga, IChapter, IPage, Manga, Chapter, Page } from '../MangaProvider';
import { MediaContainer } from '../MediaContainer';

interface IMangas {
    [key: string]: [
        {
            permalink: string,
            name: string
        }
    ]
}

interface IChapters {
    taggings: [
        {
            header: string | undefined,
            permalink: string,
            title: string
        }
    ]
}

interface IPages {
    pages: [
        {
            url: string
        }
    ]
}

export default class extends MediaContainer implements IMangaHost {

    private readonly _url = 'https://dynasty-scans.com';

    constructor() {
        super('dynasty-scans', 'DynastyScans', null, null);
        //chrome.cookies.set({ url: this._url, name: 'adult', value: 'true' });
    }

    public async GetMangas(): Promise<IManga[]> {
        let mangaList: IManga[] = [];
        for(const path of ['/series', '/anthologies', '/issues', '/doujins']) {
            const uri = new URL(path + '.json', this._url);
            const request = new ExploitedRequest(uri.href, {
                //method: 'GET',
                //mode: 'cors',
                //redirect: 'follow',
                // include credentials to apply cookies from browser window
                //credentials: 'same-origin', // 'include',
                //headers: new Headers()
            });
            const data = await HakuNeko.RequestProvider.FetchJSON<IMangas>(request);
            for(const letter in data) {
                const mangas = data[letter].map(manga => {
                    const identifier = [path, manga.permalink].join('/');
                    const title = manga.name.trim();
                    return new Manga(identifier, title, null, this);
                });
                mangaList = mangaList.concat(...mangas);
            }
        }
        return mangaList;
    }

    public async GetChapters(manga: IManga): Promise<IChapter[]> {
        const uri = new URL(manga.Identifier + '.json', this._url);
        const request = new Request(uri.href);
        const data = await HakuNeko.RequestProvider.FetchJSON<IChapters>(request);
        const chapterList = data.taggings.filter(chapter => !chapter.header).map(chapter => {
            const identifier = `/chapters/${chapter.permalink}`;
            const title = chapter.title.trim();
            const language = 'en';
            return new Chapter(identifier, title, language, manga);
        });
        // TODO increment names for duplicate chapters ???
        /*
        // rename duplicate chapters, using a stack to count preceding chapters with the same name
        let titleStack = [];
        for( let chapter of chapterList ) {
            // do not change the command order!
            let duplicateCount = titleStack.filter( t => t === chapter.title ).length;
            titleStack.push( chapter.title );
            chapter.title += duplicateCount > 0 ? ' #' + duplicateCount : '' ;
        }
        */
        return chapterList;
    }

    public async GetPages(chapter: IChapter): Promise<IPage[]> {
        const uri = new URL(chapter.Identifier + '.json', this._url);
        const request = new Request(uri.href);
        const data = await window.HakuNeko.RequestProvider.FetchJSON<IPages>(request);
        return data.pages.map(page => {
            // TODO: use LinkResolver to get absolute URL
            return new Page(this._url + page.url, chapter);
        });
    }
}