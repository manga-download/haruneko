import { Tags } from '../Tags';
import icon from './KuManga.webp';
import * as Common from './decorators/Common';
import { DecoratableMangaScraper, Manga, Page, type MangaPlugin, type Chapter } from '../providers/MangaPlugin';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

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
    });
`;

const chapterScript = `
    new Promise (resolve => {
        const chapters = [...document.querySelectorAll('a.media-chapter__link')].map(chapter => {
            return {
                id : chapter.pathname,
                title: chapter.innerText.trim()
            };
        });
        OTHER_CHAPTERS.forEach(chapter => {
            chapters.push({
                id : '/manga/'+ UMconfig.id+ '/capitulo/'+ chapter.NumCap,
                title: ['Capítulo', chapter.NumCap, (chapter.title ?? '')].join(' ').trim()
            });
        });
        resolve (chapters);
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'h1.media-name__main', Common.ElementLabelExtractor('small,div,span'))
@Common.ChaptersSinglePageJS(chapterScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kumanga', `KuManga`, 'https://www.kumanga.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
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
                Referer: new URL(`/mangalist?&page=${page}`, this.URI).href,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const { code, contents } = await FetchJSON<APIMangas>(request);
        return (code === 200 ? contents.filter(item => item.name) : []).map(manga => new Manga(this, provider, `/manga/${manga.id}/${manga.slug}`, manga.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const realUrl = (await Fetch(new Request(new URL(chapter.Identifier, this.URI), {
            method: 'HEAD'
        }))).url.replace('/c/', '/leer/');
        const pages = await FetchWindowScript<string[]>(new Request(new URL(realUrl)), pageScript, 500);
        return pages.map(page => new Page(this, chapter, new URL(page), { Referer: realUrl }));
    }
}