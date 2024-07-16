import { Tags } from '../../Tags';
import icon from './KuManga.webp';
import * as Common from '../decorators/Common';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import { FetchCSS, FetchWindowScript } from '../../platform/FetchProvider';

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
        resolve({
            referer: window.location.href,
            images: pUrl.map(page => new URL(page.imgURL, window.location.origin).href)
        });
    });
`;

@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kumanga', `KuManga`, 'https://www.kumanga.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { code, contents } = await FetchWindowScript<APIMangas>(new Request(new URL(`/mangalist?&page=${page}`, this.URI)), this.MangaScript(page));
        return code === 200 ? contents.map(manga => new Manga(this, provider, `/manga/${manga.id}`, manga.name.trim())) : [];
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
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`/${manga.Identifier}/p/${page}`, this.URI)), 'div.media-body h5 > a');
        return data.map(element => new Chapter(this, manga, element.pathname.replace('/c/', '/leer/'), element.text.replace(manga.Title, '').trim()));
    }

    private MangaScript(page: number): string {
        return `
            new Promise((resolve, reject) => {
                function btoaReverse(content) {
                    return btoa(content).split('').reverse().join('');
                }
                const data = document.querySelector('#searchinput').getAttribute('dt');
                const tokenIdentifier = btoaReverse(data).replace(/=/g, 'k');
                const tokenAttribute = btoaReverse(btoaReverse(data)).replace(/=/g, 'k').toLowerCase();
                const token = document.getElementById(tokenIdentifier).getAttribute(tokenAttribute);

                const form = new URLSearchParams();
                form.append('token', token);
                form.append('contentType', 'manga');
                form.append('retrieveCategories', false);
                form.append('retrieveAuthors', false);
                form.append('perPage', 75);
                form.append('page', ${page});

                fetch(new URL('/backend/ajax/searchengine_master2.php', window.location.origin), {
                    method: 'POST',
                    body: form.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                 .then(response => response.json()
                 .then(data => resolve(data)))
                 .catch(error => reject(error));

            });
        `;
    }
}