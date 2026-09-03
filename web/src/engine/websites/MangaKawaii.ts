import { Tags } from '../Tags';
import icon from './MangaKawaii.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.manga-view__header h1[itemprop="name headline"]')
@Common.PagesSinglePageJS(`
    new Promise(resolve => {
        const images = [];
        for (let page of pages) {
            if (page.external === 0) {
                images.push('https://' + chapter_server + '.mangakawaii.io/uploads/manga/' + oeuvre_slug + '/chapters_' + applocale + '/' + chapter_slug + '/' + page.page_image + '?' + pages.page_version);
            } else {
                images.push(new URL(page.page_image + '?' + page.page_version, location).href);
            }
        }
        resolve(images);
    });
`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakawaii', `MangaKawaii`, 'https://www.mangakawaii.io', Tags.Language.French, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const token = (await FetchCSS<HTMLMetaElement>(new Request(this.URI), 'meta[name="csrf-token"]')).at(0).content;
        const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL('changeMangaList?type=text', this.URI), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': token
            }
        }), 'ul.manga-list-text li a.alpha-link');
        return elements.map(element => {
            const { id, title } = Common.AnchorInfoExtractor(false, 'span').call(this, element, this.URI);
            return new Manga(this, provider, id, title);
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        for (const lang of ['en', 'fr']) {
            await FetchWindowScript(new Request(new URL(`/lang/${lang}`, this.URI)), '');
            const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'div#chapters td.table__chapter a');
            const chaptersLang = elements.map(anchor => new Chapter(this, manga, anchor.pathname, `${anchor.innerText.trim()} [${lang}]`, lang === 'fr' ? Tags.Language.French : Tags.Language.English));
            chapters.push(...chaptersLang);
        }
        return chapters;
    }
}