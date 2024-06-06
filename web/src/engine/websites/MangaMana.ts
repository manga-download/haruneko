import { Tags } from '../Tags';
import icon from './MangaMana.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    html: string
}

const pageScript = `
    new Promise(resolve => {
        resolve (pages.map(page =>  'https://' + cdn + '.manga-mana.com/uploads/manga/' + oeuvre_slug + '/chapters_fr/' + chapter_slug + '/' + page.image + '?' + page.version));
    });
`;

@Common.MangaCSS(/^{origin}\/m\/[^/]+/, 'h1.show_title')
@Common.ChaptersSinglePageCSS('ul.row li a', Common.AnchorInfoExtractor(false, 'div.small, span'))
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangamana', 'Manga Mana', 'https://www.manga-mana.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const token = (await FetchCSS<HTMLMetaElement>(new Request(new URL('/liste-mangas', this.URI)), 'meta[name="csrf-token"]'))[0].content;
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider, token);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList.distinct();
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin, token: string): Promise<Manga[]> {
        const endpoint = new URL('/liste-mangas', this.URI);
        const request = new Request(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-CSRF-TOKEN': token,
                'X-Requested-With': 'XMLHttpRequest',
                Referrer: endpoint.href,
                Origin: this.URI.origin
            },
            body: `page=${page}`
        });
        const result = await FetchJSON<APIMangas>(request);
        const dom = new DOMParser().parseFromString(result.html, 'text/html');
        const nodes = [...dom.querySelectorAll<HTMLAnchorElement>('a[class= ""]')];
        return nodes.map(manga => new Manga(this, provider, manga.pathname, manga.text.trim()));
    }
}