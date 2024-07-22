import { Tags } from '../Tags';
import icon from './KuManga.webp';
import * as Common from './decorators/Common';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIMangas = {
    code: number,
    contents: {
        id: number,
        name: string,
        slug: string
    }[]
}

const pageScript = `
    new Promise(resolve => {
        resolve(pUrl.map(page => new URL(page.imgURL, window.location.origin).href))
    });
`;

const getTokenScript = `
    new Promise (resolve => {
        function btoaReverse(content) {
            return btoa(content).split('').reverse().join('');
        }
        const data = btoaReverse(document.querySelector('#searchinput').getAttribute('dt'));
        const tokenIdentifier = data.replace(/=/g, 'k');
        const tokenAttribute = btoaReverse(data).replace(/=/g, 'k').toLowerCase();
        resolve(document.getElementById(tokenIdentifier).getAttribute(tokenAttribute));
    })
`;

@Common.PagesSinglePageJS(pageScript, 2000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kumanga', `KuManga`, 'https://www.kumanga.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/\\d+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS<HTMLHeadingElement>(new Request(url), 'div.title_container h1')).shift().textContent.trim();
        return new Manga(this, provider, url.match(/\/manga\/(\d+)/)[1], title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const token = await FetchWindowScript<string>(new Request(new URL(`/mangalist?&page=1`, this.URI)), getTokenScript);
        const mangaList: Array<Manga> = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider, token);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin, token: string): Promise<Manga[]> {
        const request = new Request(new URL('/backend/ajax/searchengine_master2.php', this.URI), {
            method: 'POST',
            body: new URLSearchParams({
                token: token,
                contentType: 'manga',
                retrieveCategories: 'false',
                retrieveAuthors: 'false',
                perPage: '200',
                page: page.toString()
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Origin: this.URI.origin,
                Referrer: new URL(`/mangalist?&page=${page}`, this.URI).href
            }
        });

        const { code, contents } = await FetchJSON<APIMangas>(request);
        return ( code === 200 ? contents : [] ).map(manga => new Manga(this, provider, manga.id.toString(), manga.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number) {
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`/manga/${manga.Identifier}/p/${page}`, this.URI)), 'div.media-body h5 > a');
        return data.map(element => new Chapter(this, manga, element.pathname.replace('/c/', '/leer/'), element.text.replace(manga.Title, '').trim().replace(/ -$/, '')));
    }
}