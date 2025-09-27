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

const pageScript = `pUrl.map(page => new URL(page.imgURL, window.location.origin).href);`;

const tokenScript = `
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
    [
        ... [ ...document.querySelectorAll('a.media-chapter__link') ].map(chapter => ({
            id : chapter.pathname,
            title: chapter.innerText.trim(),
        })),
        ... OTHER_CHAPTERS.map(chapter => ({
            id : '/manga/'+ UMconfig.id+ '/capitulo/'+ chapter.NumCap,
            title: ['Capítulo', chapter.NumCap, (chapter.title ?? '')].join(' ').trim(),
        })),
    ];
`;

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'h1.media-name__main', Common.WebsiteInfoExtractor({ queryBloat: 'small,div,span' }))
@Common.ChaptersSinglePageJS(chapterScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kumanga', 'KuManga', 'https://www.kumanga.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const token = await FetchWindowScript<string>(new Request(new URL(`/mangalist?&page=1`, this.URI)), tokenScript);
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
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                token: token,
                contentType: 'manga',
                retrieveCategories: 'false',
                retrieveAuthors: 'false',
                perPage: '200',
                page: page.toString()
            }).toString()
        });

        const { contents } = await FetchJSON<APIMangas>(request);
        return contents
            .filter(item => item.name)
            .map(manga => new Manga(this, provider, `/manga/${manga.id}/${manga.slug}`, manga.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const redirect = await Fetch(new Request(new URL(chapter.Identifier, this.URI), { method: 'HEAD' }));
        const request = new Request(redirect.url.replace('/c/', '/leer/'));
        const pages = await FetchWindowScript<string[]>(request, pageScript, 500);
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }
}