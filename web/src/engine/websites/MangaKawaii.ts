import { Tags } from '../Tags';
import icon from './MangaKawaii.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';

const cdn = 'https://cdn.mangakawaii.pics';

const pagesScript = `
    new Promise(resolve => {
        resolve(pages.map(page => '${cdn}/uploads/manga/'+ oeuvre_slug +'/chapters_'+applocale+'/'+chapter_slug+ '/'+page.page_image));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.manga-view__header h1[itemprop="name headline"]')
@Common.PagesSinglePageJS(pagesScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakawaii', `MangaKawaii`, 'https://www.mangakawaii.io', Tags.Language.French, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin) : Promise<Manga[]> {
        const token = await this.getToken();
        const request = new Request(new URL('changeMangaList?type=text', this.URI).href);
        request.headers.set('X-Requested-With', 'XMLHttpRequest');
        request.headers.set('X-CSRF-TOKEN', token);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.manga-list-text li a.alpha-link');
        return data.map(element => {
            const bloat = element.querySelector('span');
            if (bloat) element.removeChild(bloat);
            return new Manga(this, provider, element.pathname, element.text.trim());
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const languages = ['eng', 'fr'];
        const chapters = [];
        for (const lang of languages) {
            chapters.push(await this.getChaptersFromLanguage(manga, lang));
        }
        return chapters;
    }

    async getChaptersFromLanguage(manga: Manga, language: string): Promise<Chapter[]> {
        await this.changeLanguage(language);
        let uri = new URL(manga.Identifier, this.URI);
        let request = new Request(uri.href);
        const firstChapter = await FetchCSS<HTMLAnchorElement>(request, 'table.table--manga tbody td.table__chapter a');
        if (typeof firstChapter[0] === 'undefined') {
            return [];
        }

        uri = new URL(firstChapter[0].pathname, this.URI);
        request = new Request(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, '#dropdownMenuOffset+ul li a');
        return data.map(element => {
            return new Chapter(this, manga, element.pathname, `${element.textContent.trim()} [${language}]`);
        });

    }
    async getToken() {
        const request = new Request(this.URI.href);
        const data = await FetchCSS <HTMLMetaElement>(request, 'meta[name="csrf-token"]');
        return data[0].content;
    }

    async changeLanguage(language) {
        await FetchWindowScript(new Request(this.URI.href), ''); //necessary cause /lang redirect to last viewed manga
        const uri = new URL('/lang/' + language, this.URI);
        const request = new Request(uri.href);
        await FetchWindowScript(request, '');
    }

}